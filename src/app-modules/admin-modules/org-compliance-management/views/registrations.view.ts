import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize, forkJoin, of, switchMap} from "rxjs";
import {
    ComplianceFile, ComplianceLookups, REGISTRATION_STATE, RegistrationDetail, RegistrationInput, RegistrationKind, RegistrationRow
} from "../domains/compliance.models";
import {ComplianceApiService, errorMessageOf} from "../services/compliance-api.service";

/**
 * Licences, registrations, permits and certificates with their expiry, documents and portal login. Expiring ones get
 * a renewal task (tracked as an obligation) so they come up in the work queue and reminders.
 */
@Component({standalone: false, templateUrl: './templates/registrations.html'})
export class ComplianceRegistrationsView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    private readonly destroyRef = inject(DestroyRef);
    readonly stateBadge = REGISTRATION_STATE;
    readonly kinds: RegistrationKind[] = ['Registration', 'Licence', 'Permit', 'Certificate', 'Membership'];
    readonly states = [{v: 'active', l: 'Current'}, {v: 'expiring', l: 'Renew soon'}, {v: 'expired', l: 'Expired'}, {v: 'closed', l: 'Closed'}, {v: 'all', l: 'All'}];

    lookups: ComplianceLookups | null = null;
    state = 'active';
    search = '';
    rows: RegistrationRow[] = [];
    loading = false;
    busy = false;
    error: string | null = null;

    /** The registration open in the editor. */
    form: {id: string | null; model: RegistrationInput; detail: RegistrationDetail | null; changeSecret: boolean; revealed: string | null} | null = null;
    files: File[] = [];
    formError: string | null = null;

    constructor(private api: ComplianceApiService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: l => this.lookups = l, error: e => this.error = errorMessageOf(e, 'Could not load compliance.')});
        this.state = this.route.snapshot.queryParamMap.get('state') ?? 'active';
        this.load();
    }

    load() {
        this.loading = true;
        this.api.registrations({state: this.state, search: this.search || null, take: 100}).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: p => this.rows = p.entities,
            error: e => this.error = errorMessageOf(e, 'Could not load registrations.')
        });
    }

    add() {
        this.formError = null;
        this.files = [];
        this.form = {id: null, detail: null, changeSecret: true, revealed: null, model: {
            kind: 'Licence', name: '', authorityName: null, countryCode: this.lookups?.countries[0] ?? null, region: null, number: null, issuedOn: null, expiresOn: null,
            renewalLeadDays: 30, portalUrl: null, portalUsername: null, portalSecret: null, ownerId: null, branchId: null, notes: null, isClosed: false, fileIds: [], trackRenewal: true
        }};
    }

    open(r: RegistrationRow) {
        this.formError = null;
        this.files = [];
        this.busy = true;
        this.api.registration(r.id).pipe(finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => this.form = {id: d.row.id, detail: d, changeSecret: false, revealed: null, model: {
                kind: d.row.kind, name: d.row.name, authorityName: d.row.authorityName, countryCode: d.row.countryCode, region: d.row.region, number: d.row.number,
                issuedOn: d.row.issuedOn, expiresOn: d.row.expiresOn, renewalLeadDays: d.renewalLeadDays, portalUrl: d.portalUrl, portalUsername: d.portalUsername,
                portalSecret: null, ownerId: d.row.ownerId, branchId: d.row.branchId, notes: d.notes, isClosed: d.isClosed, fileIds: [],
                trackRenewal: d.obligations.some(o => o.name.startsWith('Renew '))
            }},
            error: e => this.error = errorMessageOf(e, 'The registration could not be opened.')
        });
    }

    pickFiles(event: Event) {
        const input = event.target as HTMLInputElement;
        this.files = [...this.files, ...Array.from(input.files ?? [])].slice(0, 10);
        input.value = '';
    }

    save() {
        const f = this.form;
        if (!f) { return; }
        if (!f.model.name?.trim()) { this.formError = 'Enter the name.'; return; }
        this.busy = true;
        this.formError = null;
        const uploads = this.files.length ? forkJoin(this.files.map(x => this.api.upload(x))) : of([] as ComplianceFile[]);
        uploads.pipe(
            switchMap(up => this.api.saveRegistration(f.id, {
                ...f.model, countryCode: f.model.countryCode?.trim().toUpperCase() || null, region: f.model.region?.trim().toUpperCase() || null,
                expiresOn: f.model.expiresOn || null, issuedOn: f.model.issuedOn || null, renewalLeadDays: +f.model.renewalLeadDays || 0,
                portalSecret: f.changeSecret ? (f.model.portalSecret ?? '') : null, fileIds: up.map(u => u.id)
            })),
            finalize(() => this.busy = false), takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => { this.form = null; this.files = []; this.load(); },
            error: e => this.formError = errorMessageOf(e, 'The registration could not be saved.')
        });
    }

    reveal() {
        const f = this.form;
        if (!f?.id) { return; }
        this.api.revealSecret(f.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: s => f.revealed = s,
            error: e => this.formError = errorMessageOf(e, 'The password could not be shown.')
        });
    }

    remove() {
        const f = this.form;
        if (!f?.id || !confirm(`Delete ${f.model.name}? To keep its history, mark it closed instead.`)) { return; }
        this.api.deleteRegistration(f.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.form = null; this.load(); },
            error: e => this.formError = errorMessageOf(e, 'The registration could not be deleted.')
        });
    }

    download(file: ComplianceFile) {
        this.api.download('registrations', this.form!.id!, file).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({error: e => this.formError = errorMessageOf(e, 'The file could not be downloaded.')});
    }

    trackById(_: number, r: RegistrationRow) { return r.id; }
}
