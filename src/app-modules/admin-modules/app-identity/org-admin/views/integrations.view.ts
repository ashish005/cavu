import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, FullDateFormatCell, MessageSeverity, ViewExtender} from "@app-global";
import {
    INTEGRATION_PAGES, IntegrationCatalog, IntegrationCategory, IntegrationDto, IntegrationField, IntegrationLogQueryOptions, IntegrationLogRes,
    IntegrationLogRow, IntegrationProvider, IntegrationQueryOptions, IntegrationRes, IntegrationRow, IntegrationTestRes
} from "../domains/org-admin.models";
import {IntegrationGridService, IntegrationLogGridService, OrgAdminApiService, OrgAdminGridEvents, errorMessageOf} from "../services/org-admin-api.service";
import {
    IntegrationActionsCell, IntegrationHealthCell, IntegrationLogActionsCell, IntegrationLogStatusCell, IntegrationNameCell
} from "../grid-cells/org-admin-cells";

/** Connections of one page (messaging, payment gateways or webhooks; route data `page`), with editor and test panel. */
@Component({standalone: false, templateUrl: './templates/integrations.html'})
export class OrgIntegrationsView extends ViewExtender<IntegrationRow> implements OnInit {
    override coreState = new IntegrationQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    readonly page = INTEGRATION_PAGES[this.activatedRoute.snapshot.data['page'] ?? 'messaging'];
    catalog: IntegrationCatalog | null = null;
    /** Category chip chosen on a page with several; null = all of the page's categories. */
    category: IntegrationCategory | null = null;
    editing: {id: string | null; provider: IntegrationProvider} | null = null;
    choosing = false;
    testing: IntegrationRow | null = null;
    testTo = '';
    testResult: IntegrationTestRes | null = null;
    testBusy = false;

    constructor(public override service: IntegrationGridService, public override activatedRoute: ActivatedRoute,
                private api: OrgAdminApiService, private events: OrgAdminGridEvents, private alerts: AlertService, private router: Router) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: true, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Connection', field: 'name', cellTemplate: IntegrationNameCell},
            {headerName: 'Kind', field: 'category', cellFn: (r: IntegrationRow) => this.categoryName(r.category)},
            {headerName: 'Status', field: 'health', cellTemplate: IntegrationHealthCell},
            {headerName: 'Last used', field: 'lastUsedAt', cellTemplate: FullDateFormatCell},
            {headerName: '', field: 'id', cellTemplate: IntegrationActionsCell}
        ];
    }

    get errorText() { return this.errorMsg ? errorMessageOf(this.errorMsg, 'The connections could not be loaded.') : null; }
    get providers() { return (this.catalog?.providers ?? []).filter(p => this.page.categories.includes(p.category)); }
    get categories() { return (this.catalog?.categories ?? []).filter(c => this.page.categories.includes(c.category)); }

    categoryName(c: IntegrationCategory) { return this.catalog?.categories.find(x => x.category === c)?.name ?? c; }

    ngOnInit() {
        this.coreState.categories = this.page.categories;
        this.api.catalog().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: c => this.catalog = c, error: () => {}});
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => {
            switch (a.action) {
                case 'open': this.actionCb(a.row); break;
                case 'test': this.openTest(a.row); break;
                case 'default': this.makeDefault(a.row); break;
                case 'activity': this.router.navigate(['../activity'], {relativeTo: this.activatedRoute, queryParams: {integrationId: a.row.id}}); break;
            }
        });
        this.populateGrid();
    }

    filterCategory(c: IntegrationCategory | null) {
        this.category = c;
        this.coreState.category = c;
        this.coreState.skip = 0;
        this.coreState.page = 1;
        this.populateGrid();
    }

    actionCb(row: IntegrationRow) {
        const provider = this.catalog?.providers.find(p => p.code === row.provider);
        if (provider) { this.editing = {id: row.id, provider}; }
    }

    add(provider: IntegrationProvider) {
        this.choosing = false;
        this.editing = {id: null, provider};
    }

    closed(changed: boolean) {
        this.editing = null;
        if (changed) { this.populateGrid(); }
    }

    makeDefault(row: IntegrationRow) {
        this.api.makeDefault(row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.alerts.showMessage('Saved', `${row.name} is now the default ${this.categoryName(row.category)} connection.`, MessageSeverity.success); this.populateGrid(); },
            error: e => this.alerts.showMessage('Not changed', errorMessageOf(e, 'Could not change the default.'), MessageSeverity.error)
        });
    }

    openTest(row: IntegrationRow) {
        this.testing = row;
        this.testTo = '';
        this.testResult = null;
    }

    get testHint() {
        switch (this.testing?.category) {
            case 'Email': return 'Email address to send a test message to (leave empty to send it to yourself).';
            case 'Sms': case 'WhatsApp': return 'Phone number in international format, e.g. +15551234567. Leave empty to only check the credentials.';
            case 'Slack': case 'Teams': return 'A test message is posted to the channel.';
            case 'Payment': return 'The credentials are checked against the gateway; nothing is charged.';
            default: return 'A signed "ping" event is posted to the URL.';
        }
    }
    get testNeedsAddress() { return ['Email', 'Sms', 'WhatsApp'].includes(this.testing?.category ?? ''); }

    runTest() {
        if (!this.testing) { return; }
        this.testBusy = true;
        this.testResult = null;
        this.api.testIntegration(this.testing.id, this.testTo.trim() || null).pipe(finalize(() => this.testBusy = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.testResult = r; this.populateGrid(); },
            error: e => this.testResult = {success: false, message: errorMessageOf(e, 'The test could not run.'), responseCode: null, durationMs: 0}
        });
    }
}

/** Create or edit one connection; the form is built from the provider's fields in the catalog. */
@Component({selector: 'org-integration-editor', standalone: false, templateUrl: './templates/integration-editor.html'})
export class OrgIntegrationEditorComponent implements OnInit {
    @Input({required: true}) provider!: IntegrationProvider;
    @Input({required: true}) catalog!: IntegrationCatalog;
    @Input() integrationId: string | null = null;
    @Output() done = new EventEmitter<boolean>();

    private readonly destroyRef = inject(DestroyRef);
    res: IntegrationRes | null = null;
    model: IntegrationDto = {category: 'Email', provider: '', name: '', isEnabled: true, isDefault: false, settings: {}, secrets: {}, events: []};
    eventFilter = '';
    customEvent = '';
    loading = false;
    saving = false;
    error: string | null = null;
    /** A secret the API generated; shown once. */
    generatedSecret: string | null = null;

    constructor(private api: OrgAdminApiService, private alerts: AlertService) {}

    get isNew() { return !this.integrationId; }
    get isWebhook() { return this.provider.category === 'Webhook'; }
    get inboundUrl() { return this.res?.inboundUrl ? this.api.absoluteApiUrl(this.res.inboundUrl) : null; }
    get events() {
        const q = this.eventFilter.trim().toLowerCase();
        return this.catalog.webhookEvents.filter(e => !q || e.includes(q));
    }

    ngOnInit() {
        this.model = {
            category: this.provider.category, provider: this.provider.code, name: this.provider.name, isEnabled: true, isDefault: false,
            settings: Object.fromEntries(this.provider.fields.filter(f => !f.secret).map(f => [f.key, f.type === 'bool' ? 'true' : null])),
            secrets: {}, events: this.isWebhook ? ['*'] : []
        };
        if (this.provider.code === 'smtp') { this.model.settings['port'] = '587'; }
        if (this.isNew) { return; }

        this.loading = true;
        this.api.integration(this.integrationId!).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => this.apply(r),
            error: e => this.error = errorMessageOf(e, 'The connection could not be loaded.')
        });
    }

    hint(f: IntegrationField) { return this.res?.secretHints?.[f.key] ?? null; }
    flag(f: IntegrationField) { return this.model.settings[f.key] === 'true'; }
    setFlag(f: IntegrationField, on: boolean) { this.model.settings[f.key] = on ? 'true' : 'false'; }
    hasEvent(e: string) { return this.model.events.includes(e); }
    flipEvent(e: string) { this.model.events = this.hasEvent(e) ? this.model.events.filter(x => x !== e) : [...this.model.events, e]; }
    addCustomEvent() {
        const e = this.customEvent.trim().toLowerCase();
        if (/^[a-z][a-z0-9_]{1,59}\.([a-z][a-z0-9_]{1,59}|\*)$/.test(e) && !this.hasEvent(e)) { this.model.events = [...this.model.events, e]; }
        this.customEvent = '';
    }

    save() {
        const missing = this.provider.fields.find(f => f.required && (f.secret ? !this.model.secrets[f.key] && !this.hint(f) : !this.model.settings[f.key]));
        if (missing) { this.error = `${missing.label} is required.`; return; }
        this.saving = true;
        this.error = null;
        const call = this.isNew ? this.api.createIntegration(this.model) : this.api.updateIntegration(this.integrationId!, this.model);
        call.pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => {
                this.alerts.showMessage('Saved', `${r.integration.integration.name} saved. Use Test to check it.`, MessageSeverity.success);
                // Keep the panel open when there is something to copy (signing secret, inbound URL of a new gateway).
                if (r.generatedSecret || (this.isNew && r.integration.inboundUrl)) {
                    this.integrationId = r.integration.integration.id;
                    this.generatedSecret = r.generatedSecret;
                    this.apply(r.integration);
                } else {
                    this.done.emit(true);
                }
            },
            error: e => this.error = errorMessageOf(e, 'The connection could not be saved.')
        });
    }

    rotate() {
        if (!this.integrationId || !confirm('Generate a new signing secret? The receiver must start using it straight away.')) { return; }
        this.api.rotateSecret(this.integrationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.generatedSecret = r.generatedSecret; this.apply(r.integration); },
            error: e => this.error = errorMessageOf(e, 'The secret could not be changed.')
        });
    }

    remove() {
        if (!this.integrationId || !confirm(`Remove "${this.model.name}"? Its stored credentials are deleted.`)) { return; }
        this.saving = true;
        this.api.deleteIntegration(this.integrationId).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.done.emit(true),
            error: e => this.error = errorMessageOf(e, 'The connection could not be removed.')
        });
    }

    copy(text: string) { navigator.clipboard?.writeText(text).then(() => this.alerts.showMessage('Copied', '', MessageSeverity.info)); }

    private apply(r: IntegrationRes) {
        this.res = r;
        this.model = {
            category: r.integration.category, provider: r.integration.provider, name: r.integration.name, isEnabled: r.integration.isEnabled,
            isDefault: r.integration.isDefault, settings: {...r.settings}, secrets: {}, events: [...r.events]
        };
    }
}

/** Everything connections did: tests, webhook deliveries, events received. */
@Component({standalone: false, templateUrl: './templates/activity.html'})
export class OrgIntegrationActivityView extends ViewExtender<IntegrationLogRow> implements OnInit {
    override coreState = new IntegrationLogQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    detail: IntegrationLogRes | null = null;
    detailError: string | null = null;

    constructor(public override service: IntegrationLogGridService, public override activatedRoute: ActivatedRoute,
                private api: OrgAdminApiService, private events: OrgAdminGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'When', field: 'createdAt', cellTemplate: FullDateFormatCell},
            {headerName: 'Connection', field: 'integrationName'},
            {headerName: 'What', field: 'kindLabel'},
            {headerName: 'Event', field: 'eventName'},
            {headerName: 'Record', field: 'recordLabel'},
            {headerName: 'Result', field: 'status', cellTemplate: IntegrationLogStatusCell},
            {headerName: '', field: 'id', cellTemplate: IntegrationLogActionsCell}
        ];
    }

    get errorText() { return this.errorMsg ? errorMessageOf(this.errorMsg, 'The activity could not be loaded.') : null; }

    ngOnInit() {
        this.coreState.integrationId = this.activatedRoute.snapshot.queryParamMap.get('integrationId');
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => {
            if (a.action === 'open') { this.open(a.row); }
            if (a.action === 'redeliver') { this.redeliver(a.row); }
        });
        this.populateGrid();
    }

    actionCb(_: any) {}

    applyFilter() {
        this.coreState.skip = 0;
        this.coreState.page = 1;
        this.populateGrid();
    }

    clearConnection() {
        this.coreState.integrationId = null;
        this.applyFilter();
    }

    open(row: IntegrationLogRow) {
        this.detail = null;
        this.detailError = null;
        this.api.activityItem(row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => this.detail = d,
            error: e => this.detailError = errorMessageOf(e, 'The details could not be loaded.')
        });
    }

    pretty(json: string | null) {
        if (!json) { return ''; }
        try { return JSON.stringify(JSON.parse(json), null, 2); } catch { return json; }
    }

    redeliver(row: IntegrationLogRow) {
        this.api.redeliver(row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => { this.alerts.showMessage('Queued', 'The delivery will be sent again within a minute.', MessageSeverity.success); this.populateGrid(); },
            error: e => this.alerts.showMessage('Not queued', errorMessageOf(e, 'Could not queue it again.'), MessageSeverity.error)
        });
    }
}
