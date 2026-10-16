import {Component, DestroyRef, OnDestroy, OnInit, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, Appearance, AppearanceApiService, MessageSeverity, ThemeManagerService, ViewExtender} from "@app-global";
import {AppearanceRow, SearchQueryOptions} from "../domains/org-admin.models";
import {AppearanceGridService, OrgAdminGridEvents, errorMessageOf} from "../services/org-admin-api.service";
import {AppearanceNameCell, AppearanceSummaryCell} from "../grid-cells/org-admin-cells";

/**
 * Appearance defaults: the organisation's, and one per member type (staff, customers, vendors…), with whether members
 * may choose their own. A member sees their own choice, else their type's default, else the organisation's.
 */
@Component({standalone: false, templateUrl: './templates/appearance.html'})
export class OrgAppearanceView extends ViewExtender<AppearanceRow> implements OnInit, OnDestroy {
    override coreState = new SearchQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    editing: {row: AppearanceRow; theme: Appearance; allowPersonal: boolean} | null = null;
    previewOnMe = false;
    saving = false;
    editError: string | null = null;

    constructor(public override service: AppearanceGridService, public override activatedRoute: ActivatedRoute,
                private api: AppearanceApiService, private events: OrgAdminGridEvents, private alerts: AlertService,
                public themeManager: ThemeManagerService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: true, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'For', field: 'name', cellTemplate: AppearanceNameCell},
            {headerName: 'Appearance', field: 'theme', cellTemplate: AppearanceSummaryCell},
            {headerName: 'Members may choose their own', field: 'allowPersonal', cellFn: (r: AppearanceRow) => r.allowPersonal ? 'Yes' : 'No'}
        ];
    }

    get errorText() { return this.errorMsg ? errorMessageOf(this.errorMsg, 'The appearance settings could not be loaded.') : null; }

    ngOnInit() {
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'open') { this.actionCb(a.row); } });
        this.populateGrid();
    }

    override ngOnDestroy() {
        if (this.previewOnMe) { this.themeManager.revert(); }
        super.ngOnDestroy();
    }

    actionCb(row: AppearanceRow) {
        this.editError = null;
        this.editing = {row, theme: this.themeManager.normalise(row.theme), allowPersonal: row.allowPersonal};
        if (this.previewOnMe) { this.themeManager.preview(this.editing.theme); }
    }

    change(theme: Appearance) {
        if (!this.editing) { return; }
        this.editing.theme = theme;
        if (this.previewOnMe) { this.themeManager.preview(theme); }
    }

    togglePreview() {
        this.previewOnMe = !this.previewOnMe;
        if (this.previewOnMe && this.editing) { this.themeManager.preview(this.editing.theme); } else { this.themeManager.revert(); }
    }

    close() {
        if (this.previewOnMe) { this.themeManager.revert(); this.previewOnMe = false; }
        this.editing = null;
    }

    save() {
        const e = this.editing;
        if (!e) { return; }
        this.saving = true;
        this.editError = null;
        this.api.saveDefault(e.row.key, e.theme, e.allowPersonal).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.alerts.showMessage('Saved', `${e.row.name}: members see it the next time they open the app${e.allowPersonal ? ', unless they chose their own' : ''}.`, MessageSeverity.success);
                this.close();
                this.populateGrid();
            },
            error: err => this.editError = errorMessageOf(err, 'The appearance could not be saved.')
        });
    }

    inherit() {
        const e = this.editing;
        if (!e || e.row.isDefault || !confirm(`Use the organisation default for ${e.row.name}?`)) { return; }
        this.saving = true;
        this.api.resetDefault(e.row.key).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.alerts.showMessage('Saved', `${e.row.name} now uses the organisation default.`, MessageSeverity.success); this.close(); this.populateGrid(); },
            error: err => this.editError = errorMessageOf(err, 'Could not switch to the organisation default.')
        });
    }
}
