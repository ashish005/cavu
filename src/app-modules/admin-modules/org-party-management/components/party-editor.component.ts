import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subject, debounceTime, distinctUntilChanged, finalize, of, switchMap} from "rxjs";
import {
    CountryRules, Duplicate, Party, PartyLookups, PartyPick, PartyRole, RELATION_TYPES, ROLE_META, newParty, roleLabel
} from "../domains/party.models";
import {PartyApiService, errorMessageOf} from "../services/party-api.service";

/**
 * Create or edit a customer, vendor or employee in the right-hand aside. Party details are shared across roles;
 * only this role's section is shown. Tax ids and bank numbers are write-only (masked on read; administrators can reveal).
 * Likely duplicates (same email or tax id) are flagged while typing, with the option to add this role to the existing party.
 */
@Component({
    selector: 'party-editor',
    standalone: false,
    templateUrl: './party-editor.component.html'
})
export class PartyEditorComponent implements OnInit {
    @Input({required: true}) role!: PartyRole;
    /** Null to create. */
    @Input() partyId: string | null = null;
    @Input({required: true}) lookups!: PartyLookups;
    /** Emits the saved party id, or null when closed without saving. */
    @Output() closed = new EventEmitter<string | null>();

    private readonly destroyRef = inject(DestroyRef);
    private readonly dupCheck$ = new Subject<void>();
    private readonly relSearch$ = new Subject<string>();
    readonly relationTypes = RELATION_TYPES;

    party: Party | null = null;
    rules: CountryRules | null = null;
    loading = false;
    saving = false;
    error: string | null = null;
    duplicates: Duplicate[] = [];
    attachTo: Duplicate | null = null;
    allowDuplicate = false;
    revealed: Record<string, string> = {};
    relationResults: PartyPick[] = [];
    relationQuery = '';

    constructor(private api: PartyApiService) {}

    get meta() { return ROLE_META[this.role]; }
    /** The organisation's own name for the role, lower case for sentences (patient, supplier…). */
    get noun() { return roleLabel(this.role, this.lookups).singular.toLowerCase(); }
    get isNew() { return !this.partyId; }
    get title() { return this.isNew ? `New ${this.noun}` : this.party?.displayName || this.noun; }
    get number() { return this.party?.[this.role]?.number ?? null; }

    ngOnInit() {
        if (this.partyId) {
            this.loading = true;
            this.api.get1(this.role, this.partyId).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
                next: p => { this.party = p; this.loadRules(); },
                error: e => this.error = errorMessageOf(e, 'Could not load.')
            });
        } else {
            this.party = newParty(this.role, this.lookups.countryCode);
            if (this.party.customer) { this.party.customer.paymentTermId = this.lookups.paymentTerms.find(t => t.isDefault)?.id ?? null; }
            if (this.party.vendor) { this.party.vendor.paymentTermId = this.lookups.paymentTerms.find(t => t.isDefault)?.id ?? null; }
            this.loadRules();
        }

        this.dupCheck$.pipe(
            debounceTime(500),
            switchMap(() => {
                const p = this.party;
                const tax = p?.taxIds.find(t => t.value);
                if (!p || (!p.email && !tax)) { return of([] as Duplicate[]); }
                return this.api.duplicates({email: p.email, taxIdType: tax?.type, taxIdValue: tax?.value, country: tax?.countryCode ?? p.countryCode, excludePartyId: this.partyId});
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({next: d => { this.duplicates = d; if (!d.some(x => x.partyId === this.attachTo?.partyId)) { this.attachTo = null; } }, error: () => this.duplicates = []});

        this.relSearch$.pipe(
            debounceTime(300), distinctUntilChanged(),
            switchMap(q => q.trim().length < 2 ? of([] as PartyPick[]) : this.api.search(q)),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(r => this.relationResults = r.filter(x => x.id !== this.partyId));
    }

    // ----- Country rules -----
    loadRules() {
        const country = this.party?.countryCode ?? this.lookups.countryCode;
        if (country === this.lookups.country.countryCode) { this.rules = this.lookups.country; return; }
        this.api.countryRules(country).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(r => this.rules = r);
    }

    countryChanged() {
        this.party!.countryCode = (this.party!.countryCode || '').toUpperCase().slice(0, 2);
        if (this.party!.countryCode.length === 2) { this.loadRules(); }
    }

    get taxTypes() {
        const kind = this.party?.kind;
        return (this.rules?.taxIdTypes ?? []).filter(t => kind === 'Person' ? t.forPersons : t.forOrganizations);
    }

    // ----- Names -----
    nameChanged() {
        const p = this.party!;
        if (p.kind === 'Person') { p.displayName = [p.firstName, p.lastName].filter(Boolean).join(' '); }
    }

    // ----- Collections -----
    addAddress() { this.party!.addresses.push({type: 'Billing', line1: '', city: '', region: '', postalCode: '', countryCode: this.party!.countryCode, isPrimary: !this.party!.addresses.length}); }
    addContact() { this.party!.contacts.push({name: '', isPrimary: !this.party!.contacts.length}); }
    addTaxId() { this.party!.taxIds.push({type: this.taxTypes[0]?.code ?? 'TIN', value: '', isPrimary: !this.party!.taxIds.length}); }
    addBank() { this.party!.bankAccounts.push({accountHolderName: this.party!.displayName, accountKind: 'Checking', isPrimary: !this.party!.bankAccounts.length}); }
    remove<T>(list: T[], i: number) { list.splice(i, 1); this.checkDuplicates(); }
    primary<T extends {isPrimary: boolean}>(list: T[], item: T) { list.forEach(x => x.isPrimary = x === item); }

    toggleBranch(id: string) {
        const ids = this.party!.branchIds;
        const i = ids.indexOf(id);
        i >= 0 ? ids.splice(i, 1) : ids.push(id);
    }

    searchRelations(q: string) { this.relationQuery = q; this.relSearch$.next(q); }
    addRelation(pick: PartyPick) {
        if (!this.party!.relationships.some(r => r.relatedPartyId === pick.id)) {
            this.party!.relationships.push({relatedPartyId: pick.id, relatedName: pick.displayName, type: this.role === 'employee' ? 'emergency_contact' : 'parent_company'});
        }
        this.relationResults = [];
        this.relationQuery = '';
    }

    // ----- Duplicates -----
    checkDuplicates() { this.dupCheck$.next(); }
    useExisting(d: Duplicate) { this.attachTo = d; this.allowDuplicate = false; }

    // ----- Sensitive values -----
    reveal(kind: 'taxId' | 'bankAccount', itemId: string | null | undefined) {
        if (!itemId || !this.partyId) { return; }
        this.api.reveal(this.partyId, kind, itemId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: v => this.revealed[itemId] = v,
            error: e => this.error = errorMessageOf(e, 'Could not reveal the value.')
        });
    }

    // ----- Save -----
    save() {
        const p = this.party!;
        this.error = null;
        if (!p.displayName.trim()) { this.error = 'Enter a name.'; return; }
        if (p.addresses.some(a => !a.line1.trim() || !a.city.trim())) { this.error = 'Every address needs a street and a city (or remove it).'; return; }
        if (p.contacts.some(c => !c.name.trim())) { this.error = 'Every contact needs a name (or remove it).'; return; }

        const body: Party = {
            ...p,
            taxIds: p.taxIds.map(t => ({...t, value: t.value?.trim() || null})),
            bankAccounts: p.bankAccounts.map(b => ({...b, accountNumber: b.accountNumber?.trim() || null}))
        };
        this.saving = true;
        const request$ = this.isNew
            ? this.api.create(this.role, body, {existingPartyId: this.attachTo?.partyId ?? null, allowDuplicate: this.allowDuplicate})
            : this.api.update(this.role, this.partyId!, body);
        request$.pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: saved => this.closed.emit(saved.id ?? null),
            error: e => {
                this.error = errorMessageOf(e, 'Could not save.');
                if (e?.status === 409) { this.checkDuplicates(); }
            }
        });
    }

    close() { this.closed.emit(null); }

    trackByIndex(i: number) { return i; }
}
