import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {
    CATEGORIES, CATEGORY_LABEL, CatalogRow, ComplianceCategory, ComplianceLookups, LEGAL_FORM_LABEL, LegalForm, MONTHS, OBLIGATION_BADGE, Profile, ProfileInput
} from "../domains/compliance.models";
import {ComplianceApiService, errorMessageOf} from "../services/compliance-api.service";

/**
 * Compliance profile (what the organisation is: from its country, branches, software and business type, plus the
 * answers here) and the global catalog of obligations, filtered to what applies, with the reasons, to adopt.
 */
@Component({standalone: false, templateUrl: './templates/setup.html'})
export class ComplianceSetupView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly legalForms = Object.keys(LEGAL_FORM_LABEL) as LegalForm[];
    readonly legalFormLabel = LEGAL_FORM_LABEL;
    readonly categories = CATEGORIES;
    readonly categoryLabel = CATEGORY_LABEL;
    readonly obligationBadge = OBLIGATION_BADGE;
    readonly months = MONTHS;

    lookups: ComplianceLookups | null = null;
    profile: Profile | null = null;
    form: ProfileInput | null = null;
    jurisdictions = '';
    catalog: CatalogRow[] = [];
    scope: 'applicable' | 'all' = 'applicable';
    country: string | null = null;
    category: ComplianceCategory | null = null;
    search = '';
    selected = new Set<number>();
    expanded: number | null = null;
    loading = false;
    saving = false;
    error: string | null = null;
    message: string | null = null;

    constructor(private api: ComplianceApiService) {}

    get canManage() { return !!this.lookups?.canManage; }

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: e => this.error = errorMessageOf(e, 'Could not load compliance.')});
        this.api.profile().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: p => this.setProfile(p), error: e => this.error = errorMessageOf(e, 'Could not load the profile.')});
        this.loadCatalog();
    }

    private setProfile(p: Profile) {
        this.profile = p;
        this.form = {legalForm: p.legalForm, conditions: [...p.conditions], jurisdictions: [...p.jurisdictions], defaultOwnerId: p.defaultOwnerId, escalateAfterDays: p.escalateAfterDays, suggest: true};
        this.jurisdictions = p.jurisdictions.join(', ');
    }

    hasCondition(code: string) { return !!this.form?.conditions.includes(code); }
    toggleCondition(code: string) {
        if (!this.form) { return; }
        this.form.conditions = this.hasCondition(code) ? this.form.conditions.filter(c => c !== code) : [...this.form.conditions, code];
    }

    saveProfile() {
        if (!this.form) { return; }
        this.saving = true;
        this.error = null;
        const body: ProfileInput = {...this.form, jurisdictions: this.jurisdictions.split(/[,\s]+/).map(s => s.trim().toUpperCase()).filter(Boolean), escalateAfterDays: +this.form.escalateAfterDays || 0};
        this.api.saveProfile(body).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: p => { this.setProfile(p); this.message = 'Profile saved. Newly applicable obligations were added to the suggestions.'; this.api.lookups(true); this.loadCatalog(); },
            error: e => this.error = errorMessageOf(e, 'The profile could not be saved.')
        });
    }

    loadCatalog() {
        this.loading = true;
        this.api.catalog({scope: this.scope, country: this.country, category: this.category, search: this.search || null})
            .pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: rows => { this.catalog = rows; this.selected.clear(); },
                error: e => this.error = errorMessageOf(e, 'Could not load the catalog.')
            });
    }

    toggle(id: number) { this.selected.has(id) ? this.selected.delete(id) : this.selected.add(id); }
    adoptSelected() { this.adopt([...this.selected], true); }

    adopt(ids: number[], activate: boolean) {
        if (!ids.length) { return; }
        this.saving = true;
        this.error = null;
        this.api.adopt({templateIds: ids, activate}).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.message = r.message; this.loadCatalog(); },
            error: e => this.error = errorMessageOf(e, 'Could not adopt them.')
        });
    }

    suggest() {
        this.saving = true;
        this.api.suggest().pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.message = r.message; this.loadCatalog(); },
            error: e => this.error = errorMessageOf(e, 'Could not refresh the suggestions.')
        });
    }
}
