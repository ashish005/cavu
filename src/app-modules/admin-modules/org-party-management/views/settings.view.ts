import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize, forkJoin} from "rxjs";
import {OrgLookup, PaymentTerm} from "../domains/party.models";
import {PartyApiService, errorMessageOf} from "../services/party-api.service";

/** Payment terms, departments and designations. */
@Component({standalone: false, templateUrl: './templates/settings.html'})
export class PartySettingsView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);

    terms: PaymentTerm[] = [];
    lists: Record<string, OrgLookup[]> = {department: [], designation: []};
    readonly categories = [{key: 'department', label: 'Departments'}, {key: 'designation', label: 'Designations'}];
    term: PaymentTerm | null = null;
    newItem: Record<string, string> = {department: '', designation: ''};
    canManage = false;
    loading = false;
    error: string | null = null;

    constructor(private api: PartyApiService) {}

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(l => this.canManage = l.canManage);
        this.load();
    }

    load() {
        this.loading = true;
        forkJoin({terms: this.api.paymentTerms(), department: this.api.orgLookups('department'), designation: this.api.orgLookups('designation')})
            .pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: r => { this.terms = r.terms; this.lists = {department: r.department, designation: r.designation}; },
                error: e => this.error = errorMessageOf(e, 'Could not load settings.')
            });
    }

    editTerm(t?: PaymentTerm) { this.term = t ? {...t} : {code: '', name: '', dueDays: 30, isDefault: false}; }

    saveTerm() {
        const t = this.term!;
        if (!t.name.trim()) { this.error = 'Name the payment term.'; return; }
        t.code = t.code.trim() || t.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
        this.do(this.api.saveTerm(t), () => this.term = null);
    }

    deleteTerm(t: PaymentTerm) { if (t.id && confirm(`Delete ${t.name}?`)) { this.do(this.api.deleteTerm(t.id)); } }

    addItem(category: string) {
        const name = this.newItem[category].trim();
        if (!name) { return; }
        this.do(this.api.saveLookup(category, {code: name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').slice(0, 60), name, sortOrder: (this.lists[category].length + 1) * 10}),
            () => this.newItem[category] = '');
    }

    rename(category: string, row: OrgLookup, name: string) {
        if (name.trim() && name.trim() !== row.name) { this.do(this.api.saveLookup(category, {...row, name: name.trim()})); }
    }

    deleteItem(category: string, row: OrgLookup) { if (row.id && confirm(`Delete ${row.name}?`)) { this.do(this.api.deleteLookup(category, row.id)); } }

    private do(request$: import("rxjs").Observable<any>, then?: () => void) {
        this.error = null;
        request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { then?.(); this.load(); },
            error: e => this.error = errorMessageOf(e, 'Could not save.')
        });
    }
}
