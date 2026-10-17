import {Component, DestroyRef, Directive, OnInit, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize} from "rxjs";
import {AlertService, DateFormatCell, FullDateFormatCell, MessageSeverity, ViewExtender} from "@app-global";
import {
    BranchDto, BranchQueryOptions, BranchRow, HostDto, HostRow, LookupItem, MemberTypeRow, RequirementDto, RequirementKind,
    RequirementQueryOptions, RequirementRow, RequirementRule, SearchQueryOptions
} from "../domains/org-admin.models";
import {
    BranchGridService, HostGridService, MemberTypeGridService, OrgAdminApiService, OrgAdminGridEvents, RequirementGridService, errorMessageOf
} from "../services/org-admin-api.service";
import {
    BranchNameCell, BranchSeedCell, HostNameCell, MemberTypeNameCell, RequirementNameCell, RequirementRulesCell
} from "../grid-cells/org-admin-cells";

/** Grid page with a right-hand editor: filter reset, saving state and error handling shared by the structure pages. */
@Directive()
abstract class EditableGrid<T> extends ViewExtender<T> {
    protected readonly destroyRef = inject(DestroyRef);
    protected readonly alerts = inject(AlertService);
    saving = false;
    editError: string | null = null;

    protected abstract readonly loadError: string;

    get errorText() { return this.errorMsg ? errorMessageOf(this.errorMsg, this.loadError) : null; }

    actionCb(row: any) { this.open(row); }
    abstract open(row: any): void;

    applyFilter() {
        this.coreState.skip = 0;
        this.coreState.page = 1;
        this.populateGrid();
    }

    /** Runs a save; on success shows the message, closes the editor (via `done`) and reloads the grid. */
    protected run<R>(call: Observable<R>, message: (r: R) => string, done: () => void, fallback: string) {
        this.saving = true;
        this.editError = null;
        call.pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.alerts.showMessage('Saved', message(r), MessageSeverity.success); done(); this.populateGrid(); },
            error: e => this.editError = errorMessageOf(e, fallback)
        });
    }

    protected listen(handlers: Record<string, (row: any) => void>) {
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => handlers[a.action]?.(a.row));
    }

    protected abstract readonly events: OrgAdminGridEvents;
}

/** Branches: add, edit, close, choose the head branch, and see each branch's setup. */
@Component({standalone: false, templateUrl: './templates/branches.html'})
export class OrgBranchesView extends EditableGrid<BranchRow> implements OnInit {
    override coreState = new BranchQueryOptions();
    protected readonly loadError = 'The branches could not be loaded.';
    editing: {id: string | null; row: BranchRow | null; model: BranchDto} | null = null;
    /** IANA time zones for the branch form (from the browser). */
    readonly timeZones: string[] = typeof (Intl as any).supportedValuesOf === 'function' ? (Intl as any).supportedValuesOf('timeZone') : [];

    constructor(public override service: BranchGridService, public override activatedRoute: ActivatedRoute,
                private api: OrgAdminApiService, protected readonly events: OrgAdminGridEvents) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: true, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Branch', field: 'name', cellTemplate: BranchNameCell},
            {headerName: 'Contact', field: 'contactLabel'},
            {headerName: 'Members', field: 'memberCount', class: 'text-right'},
            {headerName: 'Setup', field: 'seedStatus', cellTemplate: BranchSeedCell},
            {headerName: 'Added', field: 'createdAt', cellTemplate: DateFormatCell}
        ];
    }

    ngOnInit() {
        this.listen({open: r => this.open(r), reseed: r => this.reseed(r)});
        this.populateGrid();
    }

    open(row: BranchRow | null) {
        this.editError = null;
        this.editing = {
            id: row?.id ?? null, row,
            model: {
                name: row?.name ?? '', address: row?.address ?? null, websiteUrl: row?.websiteUrl ?? null, contactName: row?.contactName ?? null,
                contactNo: row?.contactNo ?? null, emailId: row?.emailId ?? null, isSelfAdministration: row?.isSelfAdministration ?? false, isActive: row?.isActive ?? true,
                countryCode: row?.countryCode ?? null, region: row?.region ?? null, city: row?.city ?? null, postalCode: row?.postalCode ?? null,
                timeZone: row?.timeZone ?? null, taxRegistrationNo: row?.taxRegistrationNo ?? null, currencyCode: row?.currencyCode ?? null
            }
        };
    }

    save() {
        const e = this.editing;
        if (!e) { return; }
        if (!e.model.name?.trim()) { this.editError = 'Give the branch a name.'; return; }
        this.run(e.id ? this.api.updateBranch(e.id, e.model) : this.api.createBranch(e.model),
            b => e.id ? `${b.name} saved.` : `${b.name} added. It is being set up and will be ready in a minute or two.`,
            () => this.editing = null, 'The branch could not be saved.');
    }

    makeHead() {
        const row = this.editing?.row;
        if (!row || !confirm(`Make ${row.name} the head branch?`)) { return; }
        this.run(this.api.makeHeadBranch(row.id), b => `${b.name} is now the head branch.`, () => this.editing = null, 'The head branch could not change.');
    }

    reseed(row: BranchRow) {
        if (!confirm(`Run the setup of ${row.name} again? Anything already set up is kept.`)) { return; }
        this.api.reseedBranch(row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.alerts.showMessage('Queued', `${row.name} will be set up again shortly.`, MessageSeverity.info); this.populateGrid(); },
            error: e => this.alerts.showMessage('Not queued', errorMessageOf(e, 'Could not queue the setup.'), MessageSeverity.error)
        });
    }
}

/** Host names (domains) the organisation is reached on. */
@Component({standalone: false, templateUrl: './templates/hosts.html'})
export class OrgHostsView extends EditableGrid<HostRow> implements OnInit {
    override coreState = new SearchQueryOptions();
    protected readonly loadError = 'The host names could not be loaded.';
    editing: {id: number | null; model: HostDto} | null = null;

    constructor(public override service: HostGridService, public override activatedRoute: ActivatedRoute,
                private api: OrgAdminApiService, protected readonly events: OrgAdminGridEvents) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: true, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Host name', field: 'hostName', cellTemplate: HostNameCell},
            {headerName: 'Added', field: 'createdAt', cellTemplate: FullDateFormatCell}
        ];
    }

    ngOnInit() {
        this.listen({open: r => this.open(r)});
        this.populateGrid();
    }

    open(row: HostRow | null) {
        this.editError = null;
        this.editing = {id: row ? Number(row.id) : null, model: {hostName: row?.hostName ?? '', enable: row?.enable ?? true, isUnderConstruction: row?.isUnderConstruction ?? false}};
    }

    save() {
        const e = this.editing;
        if (!e) { return; }
        if (!e.model.hostName?.trim()) { this.editError = 'Enter the host name.'; return; }
        this.run(e.id ? this.api.updateHost(e.id, e.model) : this.api.createHost(e.model), h => `${h.hostName} saved.`, () => this.editing = null, 'The host name could not be saved.');
    }

    remove() {
        const e = this.editing;
        if (!e?.id || !confirm(`Remove ${e.model.hostName}? Visitors will no longer reach your organisation on it.`)) { return; }
        this.run(this.api.deleteHost(e.id), () => `${e.model.hostName} removed.`, () => this.editing = null, 'The host name could not be removed.');
    }
}

/** Member types (employee, customer, vendor…): display name, number format and relations. */
@Component({standalone: false, templateUrl: './templates/member-types.html'})
export class OrgMemberTypesView extends EditableGrid<MemberTypeRow> implements OnInit {
    override coreState = new SearchQueryOptions();
    protected readonly loadError = 'The member types could not be loaded.';
    editing: {row: MemberTypeRow; name: string; format: string} | null = null;
    newRelation = '';

    constructor(public override service: MemberTypeGridService, public override activatedRoute: ActivatedRoute,
                private api: OrgAdminApiService, protected readonly events: OrgAdminGridEvents) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: true, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Member type', field: 'name', cellTemplate: MemberTypeNameCell},
            {headerName: 'Members', field: 'memberCount', class: 'text-right'},
            {headerName: 'Roles', field: 'roleCount', class: 'text-right'},
            {headerName: 'Relations', field: 'relationLabel'},
            {headerName: 'Ledger group', field: 'accountGroupName'}
        ];
    }

    /** The format with today's year and the counter at 1, as members will see it. */
    get preview(): string {
        const f = (this.editing?.format || '').toUpperCase().replace('{YYYY}', '{yyyy}').replace('{YY}', '{yy}');
        const year = new Date().getFullYear();
        const out = f.replace('{yyyy}', String(year)).replace('{yy}', String(year % 100).padStart(2, '0'));
        return out.replace(/\{(0+)\}/, (_, z: string) => '1'.padStart(z.length, '0'));
    }

    ngOnInit() {
        this.listen({open: r => this.open(r)});
        this.populateGrid();
    }

    open(row: MemberTypeRow) {
        this.editError = null;
        this.newRelation = '';
        this.editing = {row, name: row.name, format: row.registrationNoFormat ?? ''};
    }

    save() {
        const e = this.editing;
        if (!e) { return; }
        this.run(this.api.updateMemberType(e.row.id, {name: e.name.trim(), registrationNoFormat: e.format.trim() || null}),
            t => `${t.name} saved.`, () => this.editing = null, 'The member type could not be saved.');
    }

    addRelation() {
        const e = this.editing;
        const name = this.newRelation.trim();
        if (!e || !name) { return; }
        this.relationCall(this.api.addRelation(e.row.id, name), () => this.newRelation = '');
    }

    removeRelation(r: LookupItem) {
        const e = this.editing;
        if (!e || !confirm(`Remove the relation "${r.name}"?`)) { return; }
        this.relationCall(this.api.removeRelation(e.row.id, r.id), () => {});
    }

    private relationCall(call: Observable<MemberTypeRow>, after: () => void) {
        this.saving = true;
        this.editError = null;
        call.pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: t => { if (this.editing) { this.editing.row = t; } after(); this.populateGrid(); },
            error: err => this.editError = errorMessageOf(err, 'The relation could not be changed.')
        });
    }
}

/** What members must provide: contact methods, addresses and documents, per member type. */
@Component({standalone: false, templateUrl: './templates/requirements.html'})
export class OrgRequirementsView extends EditableGrid<RequirementRow> implements OnInit {
    override coreState = new RequirementQueryOptions();
    protected readonly loadError = 'The requirements could not be loaded.';
    readonly kinds: {kind: RequirementKind; name: string; hint: string}[] = [
        {kind: 'Contact', name: 'Contacts', hint: 'Email and phone: required ones must be filled in when a customer, vendor or employee is saved.'},
        {kind: 'Address', name: 'Addresses', hint: 'Required addresses must be added when a customer, vendor or employee is saved.'},
        {kind: 'Document', name: 'Documents', hint: 'The documents you collect from each member type, as a checklist with accepted file types and size.'}
    ];
    memberTypes: MemberTypeRow[] = [];
    editing: {id: string | null; row: RequirementRow | null; model: RequirementDto} | null = null;

    constructor(public override service: RequirementGridService, public override activatedRoute: ActivatedRoute,
                private api: OrgAdminApiService, protected readonly events: OrgAdminGridEvents, private memberTypeGrid: MemberTypeGridService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: true, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Requirement', field: 'name', cellTemplate: RequirementNameCell},
            {headerName: 'Who must provide it', field: 'rules', cellTemplate: RequirementRulesCell}
        ];
    }

    get kindHint() { return this.kinds.find(k => k.kind === this.coreState.kind)?.hint; }

    ngOnInit() {
        const q = new SearchQueryOptions();
        q.take = 100;
        this.memberTypeGrid.list(q).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: r => this.memberTypes = (r.entities ?? []) as MemberTypeRow[], error: () => {}});
        this.listen({open: r => this.open(r)});
        this.populateGrid();
    }

    showKind(kind: RequirementKind) {
        this.coreState.kind = kind;
        this.applyFilter();
    }

    open(row: RequirementRow | null) {
        this.editError = null;
        this.editing = {
            id: row?.id ?? null, row,
            model: {
                kind: row?.kind ?? this.coreState.kind, name: row?.name ?? '', description: row?.description ?? null,
                maxSizeMb: row?.maxSizeMb ?? 5, allowedExtensions: row?.allowedExtensions ?? '.pdf,.jpg,.jpeg,.png',
                isActive: row?.isActive ?? true, rules: (row?.rules ?? []).map(r => ({...r}))
            }
        };
    }

    rule(typeId: string): RequirementRule | undefined { return this.editing?.model.rules.find(r => r.userTypeId === typeId); }

    /** Not asked / optional / required, cycling through the three states. */
    setRule(typeId: string, state: 'off' | 'optional' | 'required') {
        const m = this.editing?.model;
        if (!m) { return; }
        const existing = this.rule(typeId);
        if (state === 'off') { m.rules = m.rules.filter(r => r.userTypeId !== typeId); return; }
        if (existing) { existing.isMandatory = state === 'required'; return; }
        m.rules = [...m.rules, {userTypeId: typeId, isMandatory: state === 'required', verificationRequired: false}];
    }

    state(typeId: string): 'off' | 'optional' | 'required' {
        const r = this.rule(typeId);
        return !r ? 'off' : r.isMandatory ? 'required' : 'optional';
    }

    save() {
        const e = this.editing;
        if (!e) { return; }
        if (!e.model.name?.trim()) { this.editError = 'Give the requirement a name.'; return; }
        const body: RequirementDto = {...e.model, name: e.model.name.trim(), rules: e.model.rules.map(r => ({userTypeId: r.userTypeId, isMandatory: r.isMandatory, verificationRequired: r.verificationRequired}))};
        this.run(e.id ? this.api.updateRequirement(e.id, body) : this.api.createRequirement(body), r => `${r.name} saved.`, () => this.editing = null, 'The requirement could not be saved.');
    }

    remove() {
        const e = this.editing;
        if (!e?.id || !confirm(`Delete "${e.model.name}"?`)) { return; }
        this.run(this.api.deleteRequirement(e.id), () => `${e.model.name} deleted.`, () => this.editing = null, 'The requirement could not be deleted.');
    }
}
