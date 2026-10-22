import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subject, catchError, debounceTime, finalize, forkJoin, of, switchMap, tap} from "rxjs";
import {
    NamedRef, Page, TEAM_RULE_KINDS, TEAM_STRATEGIES, Team, TeamLookups, TeamMember, TeamMemberRow, TeamRule, TeamRuleKind, TeamSummary, membershipOf,
    newTeam, toCode
} from "./team.models";
import {TeamApiService, teamErrorOf} from "./team-api.service";

/**
 * Teams: a name, the people in it (chosen by hand and/or everyone matching simple rules such as "has the role
 * Accountant"), how tasks are shared, a lead for escalations and, optionally, outside contacts for notifications.
 * The editor shows who is in the team right now as you change it.
 */
@Component({standalone: false, templateUrl: './teams.html'})
export class TeamsView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    private readonly preview$ = new Subject<void>();
    readonly strategies = TEAM_STRATEGIES;
    readonly ruleKinds = TEAM_RULE_KINDS;
    readonly pageSize = 50;

    lookups: TeamLookups | null = null;
    teams: TeamSummary[] = [];
    filter = '';
    loading = false;
    error: string | null = null;

    editing: Team | null = null;
    /** Category, description, code and outside contacts are folded away until asked for. */
    showMore = false;
    saving = false;
    editError: string | null = null;
    contact: TeamMember = {name: '', email: '', phone: ''};

    preview: TeamMemberRow[] = [];
    previewTotal = 0;
    previewSearch = '';
    previewLoading = false;
    previewError: string | null = null;

    constructor(private api: TeamApiService) {}

    get isAdmin() { return this.lookups?.isAdmin ?? false; }

    ngOnInit() {
        this.load();
        // Live members: the first page for the definition being edited. Errors are shown, not fatal.
        this.preview$.pipe(
            debounceTime(400),
            tap(() => { this.previewLoading = true; this.previewError = null; }),
            switchMap(() => this.api.preview(this.payload(), {skip: 0, take: this.pageSize, search: this.previewSearch || null}).pipe(
                catchError(e => { this.previewError = teamErrorOf(e, 'Could not work out the members.'); return of({items: [], total: 0} as Page<TeamMemberRow>); }),
                finalize(() => this.previewLoading = false))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(page => { this.preview = page.items; this.previewTotal = page.total; });
    }

    load() {
        this.loading = true;
        this.error = null;
        forkJoin({lookups: this.api.lookups(), teams: this.api.teams()})
            .pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: r => { this.lookups = r.lookups; this.teams = r.teams; },
                error: e => this.error = teamErrorOf(e, 'Could not load teams.')
            });
    }

    // ----- List -----

    get shown(): TeamSummary[] {
        const term = this.filter.trim().toLowerCase();
        return this.teams.filter(t => !term || `${t.name} ${t.code} ${t.category ?? ''} ${t.description ?? ''}`.toLowerCase().includes(term));
    }

    get categories(): string[] { return [...new Set(this.teams.map(t => t.category).filter((c): c is string => !!c))].sort(); }

    strategyLabel(s: string) { return this.strategies.find(x => x.value === s)?.label ?? s; }

    /** "5 people · everyone with the role Accountant" style summary. */
    membersText(t: TeamSummary) {
        const parts = [`${t.memberCount} ${t.memberCount === 1 ? 'person' : 'people'}`];
        if (t.ruleCount) { parts.push('updates automatically'); }
        if (t.externalCount) { parts.push(`${t.externalCount} outside contact${t.externalCount === 1 ? '' : 's'}`); }
        return parts.join(' · ');
    }

    // ----- Editor -----

    open(summary?: TeamSummary) {
        this.editError = null;
        this.contact = {name: '', email: '', phone: ''};
        this.previewSearch = '';
        this.preview = [];
        this.previewTotal = 0;
        if (!summary) {
            this.editing = newTeam();
            this.showMore = false;
            return;
        }
        this.api.team(summary.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: t => {
                this.editing = t;
                this.showMore = !!(t.category || t.description || t.members.some(m => !m.userId));
                this.refreshPreview();
            },
            error: e => this.error = teamErrorOf(e, 'Could not open the team.')
        });
    }

    nameChanged() {
        if (this.editing && !this.editing.id) { this.editing.code = toCode(this.editing.name); }
    }

    get chosen() { return this.editing?.members.filter(m => m.userId && !m.isExcluded) ?? []; }
    get excluded() { return this.editing?.members.filter(m => m.userId && m.isExcluded) ?? []; }
    get contacts() { return this.editing?.members.filter(m => !m.userId) ?? []; }
    get hasRules() { return (this.editing?.rules.length ?? 0) > 0; }

    userName(id: string | null | undefined) { return this.lookups?.users.find(u => u.id === id)?.name ?? 'Unknown'; }
    availableUsers(excluded: boolean) {
        const taken = new Set((this.editing?.members ?? []).filter(m => m.userId && !!m.isExcluded === excluded).map(m => m.userId));
        return (this.lookups?.users ?? []).filter(u => !taken.has(u.id));
    }

    // Rules ("also everyone who…")
    addRule() { this.editing?.rules.push({kind: 'Role', operator: 'In', values: []}); }
    removeRule(i: number) {
        const t = this.editing;
        if (!t) { return; }
        t.rules.splice(i, 1);
        if (!t.rules.length) { t.members = t.members.filter(m => !m.isExcluded); }
        this.refreshPreview();
    }
    options(kind: TeamRuleKind): NamedRef[] {
        if (!this.lookups) { return []; }
        return kind === 'UserType' ? this.lookups.userTypes : kind === 'Branch' ? this.lookups.branches : this.lookups.roles;
    }
    optionName(kind: TeamRuleKind, id: string) { return this.options(kind).find(o => o.id === id)?.name ?? 'Removed'; }
    addValue(rule: TeamRule, id: string) {
        if (id && !rule.values.includes(id)) { rule.values.push(id); this.refreshPreview(); }
    }
    removeValue(rule: TeamRule, i: number) { rule.values.splice(i, 1); this.refreshPreview(); }
    kindChanged(rule: TeamRule) { rule.values = []; this.refreshPreview(); }

    // People
    addPerson(id: string, excluded: boolean) {
        const team = this.editing;
        if (!team || !id) { return; }
        team.members = team.members.filter(m => m.userId !== id);
        team.members.push({userId: id, isExcluded: excluded});
        this.refreshPreview();
    }
    remove(m: TeamMember) {
        if (!this.editing) { return; }
        this.editing.members = this.editing.members.filter(x => x !== m);
        this.refreshPreview();
    }

    addContact() {
        const c = this.contact;
        if (!this.editing || !c.name?.trim() || (!c.email?.trim() && !c.phone?.trim())) {
            this.editError = 'An outside contact needs a name and an email or phone number (with the country code).';
            return;
        }
        this.editError = null;
        this.editing.members.push({name: c.name.trim(), email: c.email?.trim() || null, phone: c.phone?.trim() || null});
        this.contact = {name: '', email: '', phone: ''};
    }

    // Live members
    refreshPreview() { if (this.editing) { this.preview$.next(); } }

    /** Loads the next page as the list nears its end. */
    onScrolled(index: number) {
        if (!this.editing || this.previewLoading || this.preview.length >= this.previewTotal || index + 20 < this.preview.length) { return; }
        this.previewLoading = true;
        this.api.preview(this.payload(), {skip: this.preview.length, take: this.pageSize, search: this.previewSearch || null})
            .pipe(finalize(() => this.previewLoading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({next: page => { this.preview = [...this.preview, ...page.items]; this.previewTotal = page.total; }});
    }

    trackByUser(_: number, row: TeamMemberRow) { return row.userId; }

    save() {
        const t = this.editing;
        if (!t) { return; }
        if (!t.name.trim()) { this.editError = 'Give the team a name.'; return; }
        if (!t.code.trim()) { t.code = toCode(t.name); }
        if (t.rules.some(r => !r.values.length)) { this.editError = 'Every rule needs at least one choice (or remove it).'; return; }
        const p = this.payload();
        if (!p.members.some(m => m.userId && !m.isExcluded) && !p.rules.length && !p.members.some(m => !m.userId)) {
            this.editError = 'Add at least one person, a rule or an outside contact.';
            return;
        }
        this.saving = true;
        this.editError = null;
        this.api.save(p).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.editing = null; this.load(); },
            error: e => this.editError = teamErrorOf(e, 'The team could not be saved.')
        });
    }

    delete(t: TeamSummary) {
        if (!confirm(`Delete the team "${t.name}"? Tasks already routed to it keep their assignee.`)) { return; }
        this.api.delete(t.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.teams = this.teams.filter(x => x.id !== t.id),
            error: e => this.error = teamErrorOf(e, 'Could not delete the team.')
        });
    }

    private payload(): Team {
        const t = this.editing!;
        const rules = t.rules.filter(r => r.values.length);
        const draft: Team = {...t, category: t.category?.trim() || null, rules, members: rules.length ? t.members : t.members.filter(m => !m.isExcluded)};
        return {...draft, membershipMode: membershipOf(draft)};
    }
}
