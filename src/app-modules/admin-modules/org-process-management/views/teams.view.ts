import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subject, catchError, debounceTime, finalize, forkJoin, of, switchMap, tap} from "rxjs";
import {
    NamedRef, Page, ProcessLookups, TEAM_MODES, TEAM_RULE_KINDS, TEAM_STRATEGIES, Team, TeamMember, TeamMemberRow, TeamRule, TeamRuleKind,
    TeamSummary, newTeam
} from "../domains/process.models";
import {ProcessApiService, errorMessageOf} from "../services/process-api.service";

/**
 * Workflow teams (after BAS user groups): who belongs — chosen people, rule-based (user type, role, branch access) or
 * both, minus exclusions — how tasks are routed to them (shared queue, round-robin, least busy), their lead (receives
 * escalations) and external contacts for notifications. The editor previews matching members live.
 */
@Component({standalone: false, templateUrl: './templates/teams.html'})
export class TeamsView implements OnInit {
    @ViewChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate: TemplateRef<any>;

    private readonly destroyRef = inject(DestroyRef);
    private readonly preview$ = new Subject<void>();
    readonly modes = TEAM_MODES;
    readonly strategies = TEAM_STRATEGIES;
    readonly ruleKinds = TEAM_RULE_KINDS;
    readonly pageSize = 50;

    lookups: ProcessLookups | null = null;
    teams: TeamSummary[] = [];
    filter = '';
    loading = false;
    error: string | null = null;

    editing: Team | null = null;
    saving = false;
    editError: string | null = null;
    contact: TeamMember = {name: '', email: '', phone: ''};

    preview: TeamMemberRow[] = [];
    previewTotal = 0;
    previewSearch = '';
    previewLoading = false;
    previewError: string | null = null;

    constructor(private api: ProcessApiService) {}

    ngOnInit() {
        this.load();
        // Live preview: the first page of members for the definition being edited. Errors are shown, not fatal.
        this.preview$.pipe(
            debounceTime(400),
            tap(() => { this.previewLoading = true; this.previewError = null; }),
            switchMap(() => this.api.previewTeam(this.payload(), {skip: 0, take: this.pageSize, search: this.previewSearch || null}).pipe(
                catchError(e => { this.previewError = errorMessageOf(e, 'Could not resolve members.'); return of({items: [], total: 0} as Page<TeamMemberRow>); }),
                finalize(() => this.previewLoading = false))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(page => { this.preview = page.items; this.previewTotal = page.total; });
    }

    load() {
        this.loading = true;
        forkJoin({lookups: this.api.lookups(true), teams: this.api.teams()})
            .pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: r => { this.lookups = r.lookups; this.teams = r.teams; },
                error: e => this.error = errorMessageOf(e, 'Could not load teams.')
            });
    }

    // ----- List -----
    get groups(): {category: string; teams: TeamSummary[]}[] {
        const term = this.filter.trim().toLowerCase();
        const shown = this.teams.filter(t => !term || `${t.name} ${t.code} ${t.category ?? ''}`.toLowerCase().includes(term));
        const map = new Map<string, TeamSummary[]>();
        shown.forEach(t => map.set(t.category || 'Other', [...(map.get(t.category || 'Other') ?? []), t]));
        return [...map.entries()].map(([category, teams]) => ({category, teams}));
    }

    get categories(): string[] { return [...new Set(this.teams.map(t => t.category).filter((c): c is string => !!c))].sort(); }

    modeLabel(mode: string) { return this.modes.find(m => m.value === mode)?.label ?? mode; }
    strategyLabel(s: string) { return this.strategies.find(x => x.value === s)?.label ?? s; }

    // ----- Editor -----
    open(summary?: TeamSummary) {
        this.editError = null;
        this.contact = {name: '', email: '', phone: ''};
        this.previewSearch = '';
        this.preview = [];
        this.previewTotal = 0;
        if (!summary) {
            this.editing = newTeam();
            return;
        }
        this.api.team(summary.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: t => { this.editing = t; this.refreshPreview(); },
            error: e => this.error = errorMessageOf(e, 'Could not load the team.')
        });
    }

    nameChanged() {
        if (this.editing && !this.editing.id) {
            this.editing.code = this.editing.name.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);
        }
    }

    get modeHint() { return this.modes.find(m => m.value === this.editing?.membershipMode)?.hint ?? ''; }
    get usesRules() { return this.editing?.membershipMode !== 'Static'; }
    get usesChosen() { return this.editing?.membershipMode !== 'Dynamic'; }
    get chosen() { return this.editing?.members.filter(m => m.userId && !m.isExcluded) ?? []; }
    get excluded() { return this.editing?.members.filter(m => m.userId && m.isExcluded) ?? []; }
    get contacts() { return this.editing?.members.filter(m => !m.userId) ?? []; }

    userName(id: string | null | undefined) { return this.lookups?.users.find(u => u.id === id)?.name ?? 'Unknown'; }

    setMode(mode: Team['membershipMode']) {
        if (!this.editing) { return; }
        this.editing.membershipMode = mode;
        if (mode !== 'Static' && !this.editing.rules.length) { this.editing.rules.push({kind: 'Role', operator: 'In', values: []}); }
        this.refreshPreview();
    }

    // Rules
    addRule() { this.editing?.rules.push({kind: 'Role', operator: 'In', values: []}); }
    removeRule(i: number) { this.editing?.rules.splice(i, 1); this.refreshPreview(); }

    options(kind: TeamRuleKind): NamedRef[] {
        if (!this.lookups) { return []; }
        return kind === 'UserType' ? this.lookups.userTypes : kind === 'Branch' ? this.lookups.branches : this.lookups.roles.map(r => ({id: r.id, name: r.name}));
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
            this.editError = 'An external contact needs a name and an email or phone (+country code).';
            return;
        }
        this.editError = null;
        this.editing.members.push({name: c.name.trim(), email: c.email?.trim() || null, phone: c.phone?.trim() || null});
        this.contact = {name: '', email: '', phone: ''};
    }

    // Preview
    refreshPreview() { if (this.editing) { this.preview$.next(); } }

    /** Loads the next page as the virtual list nears its end. */
    onScrolled(index: number) {
        if (!this.editing || this.previewLoading || this.preview.length >= this.previewTotal || index + 20 < this.preview.length) { return; }
        this.previewLoading = true;
        this.api.previewTeam(this.payload(), {skip: this.preview.length, take: this.pageSize, search: this.previewSearch || null})
            .pipe(finalize(() => this.previewLoading = false), takeUntilDestroyed(this.destroyRef))
            .subscribe({next: page => { this.preview = [...this.preview, ...page.items]; this.previewTotal = page.total; }});
    }

    trackByUser(_: number, row: TeamMemberRow) { return row.userId; }

    save() {
        const t = this.editing;
        if (!t) { return; }
        if (!t.name.trim() || !t.code.trim()) { this.editError = 'Give the team a name.'; return; }
        if (this.usesRules && t.rules.some(r => !r.values.length)) { this.editError = 'Every rule needs at least one value (or remove it).'; return; }
        this.saving = true;
        this.editError = null;
        this.api.saveTeam(this.payload()).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.editing = null; this.load(); },
            error: e => this.editError = errorMessageOf(e, 'The team could not be saved.')
        });
    }

    delete(t: TeamSummary) {
        if (!confirm(`Delete the team "${t.name}"?`)) { return; }
        this.api.deleteTeam(t.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.teams = this.teams.filter(x => x.id !== t.id),
            error: e => this.error = errorMessageOf(e, 'Could not delete the team.')
        });
    }

    private payload(): Team {
        const t = this.editing!;
        return {
            ...t,
            category: t.category?.trim() || null,
            rules: t.membershipMode === 'Static' ? [] : t.rules.filter(r => r.values.length),
            members: t.members.filter(m => t.membershipMode !== 'Static' || !m.isExcluded)
        };
    }
}
