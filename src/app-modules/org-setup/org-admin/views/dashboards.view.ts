import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity, ViewExtender} from "@app-global";
import {PortletQueryOptions, PortletRole, PortletRow} from "../domains/org-admin.models";
import {OrgAdminApiService, OrgAdminGridEvents, PortletGridService, errorMessageOf} from "../services/org-admin-api.service";
import {PortletAudienceCell, PortletNameCell} from "../grid-cells/org-admin-cells";

/**
 * Dashboard portlets: switch each on or off, place it, size it, and choose which roles see it. A member sees a portlet
 * when it suits their member type, they hold its permission, and at least one of their roles is ticked.
 */
@Component({standalone: false, templateUrl: './templates/dashboards.html'})
export class OrgDashboardsView extends ViewExtender<PortletRow> implements OnInit {
    override coreState = new PortletQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    readonly widths = [{value: 3, name: 'Quarter'}, {value: 4, name: 'Third'}, {value: 6, name: 'Half'}, {value: 8, name: 'Two thirds'}, {value: 12, name: 'Full width'}];
    readonly audiences = [{code: 'employee', name: 'Staff'}, {code: 'customer', name: 'Customers'}, {code: 'vendor', name: 'Vendors'}];
    editing: {row: PortletRow; isEnabled: boolean; sortOrder: number; width: number; visible: Record<string, boolean>} | null = null;
    saving = false;
    editError: string | null = null;

    constructor(public override service: PortletGridService, public override activatedRoute: ActivatedRoute,
                private api: OrgAdminApiService, private events: OrgAdminGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: true, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Portlet', field: 'name', cellTemplate: PortletNameCell},
            {headerName: 'For', field: 'audienceLabel'},
            {headerName: 'Seen by', field: 'visibleRoles', cellTemplate: PortletAudienceCell},
            {headerName: 'Size', field: 'widthLabel'},
            {headerName: 'Order', field: 'sortOrder', class: 'text-right'}
        ];
    }

    get errorText() { return this.errorMsg ? errorMessageOf(this.errorMsg, 'The dashboard settings could not be loaded.') : null; }

    /** The portlet's roles grouped by member type, for the editor. */
    get roleGroups(): {type: string; roles: PortletRole[]}[] {
        const roles = this.editing?.row.roles ?? [];
        return [...new Set(roles.map(r => r.userTypeName))].map(type => ({type, roles: roles.filter(r => r.userTypeName === type)}));
    }

    ngOnInit() {
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (a.action === 'open') { this.actionCb(a.row); } });
        this.populateGrid();
    }

    actionCb(row: PortletRow) {
        this.editError = null;
        this.editing = {
            row, isEnabled: row.isEnabled, sortOrder: row.sortOrder, width: row.width,
            visible: Object.fromEntries(row.roles.map(r => [r.roleId, r.isVisible]))
        };
    }

    applyFilter() {
        this.coreState.skip = 0;
        this.coreState.page = 1;
        this.populateGrid();
    }

    setAll(on: boolean) {
        if (!this.editing) { return; }
        this.editing.row.roles.filter(r => r.hasPermission).forEach(r => this.editing!.visible[r.roleId] = on);
    }

    save() {
        const e = this.editing;
        if (!e) { return; }
        this.saving = true;
        this.editError = null;
        const body = {
            isEnabled: e.isEnabled, sortOrder: Number(e.sortOrder) || 0, width: Number(e.width),
            roles: e.row.roles.map(r => ({roleId: r.roleId, isVisible: e.visible[r.roleId] !== false}))
        };
        this.api.savePortlet(e.row.code, body).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => {
                this.alerts.showMessage('Saved', `${r.name}: members see the change the next time they open their dashboard.`, MessageSeverity.success);
                this.editing = null;
                this.populateGrid();
            },
            error: err => this.editError = errorMessageOf(err, 'The dashboard setting could not be saved.')
        });
    }
}
