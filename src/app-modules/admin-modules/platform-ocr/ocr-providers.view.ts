import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {OcrConfigApiService, ocrErrorOf} from "./ocr-config-api.service";
import {OCR_SETTING_LABEL, OcrConfigInput, OcrConfigList, OcrConfigRow, OcrProviderInfo} from "./ocr-config.models";

interface Editor { info: OcrProviderInfo; model: OcrConfigInput; options: {key: string; value: string}[]; hasSecret: boolean; secretHint: string | null; removeSecret: boolean; isNew: boolean; }

/**
 * Platform › OCR providers: for every country (*) and for each country that needs its own set-up, which OCR
 * providers organisations get, in which order, with which models, endpoints and keys. A country's row replaces the
 * * row of that provider there. Keys are stored encrypted and never shown again; changes apply at once on this
 * server and within five minutes on the others.
 */
@Component({standalone: false, templateUrl: './templates/ocr-providers.html'})
export class OcrProvidersView implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    readonly settingLabel = OCR_SETTING_LABEL;
    /** '*' (every country) or an ISO-2 code. */
    country = '*';
    newCountry = '';
    data: OcrConfigList | null = null;
    /** Rows of the selected scope (cached for the template). */
    rows: OcrConfigRow[] = [];
    /** Providers without a row in the selected scope. */
    addable: OcrProviderInfo[] = [];
    editing: Editor | null = null;
    loading = false;
    saving = false;
    error: string | null = null;
    formError: string | null = null;

    constructor(private api: OcrConfigApiService, private alerts: AlertService) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.error = null;
        this.api.list(this.country === '*' ? '*' : this.country).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => {
                this.data = d;
                this.rows = d.rows.filter(r => r.countryCode === this.country);
                this.addable = d.providers.filter(p => !this.rows.some(r => r.provider === p.code));
            },
            error: e => this.error = ocrErrorOf(e, 'The OCR configuration could not be loaded.')
        });
    }

    pick(country: string) { this.country = country; this.load(); }

    addCountry() {
        const c = this.newCountry.trim().toUpperCase();
        if (!/^[A-Z]{2}$/.test(c)) { this.alerts.showMessage('OCR providers', 'Enter a two-letter country code (IN, US, DE…).', MessageSeverity.warn); return; }
        this.newCountry = '';
        this.pick(c);
    }

    info(code: string) { return this.data?.providers.find(p => p.code === code); }

    /** The settings this provider uses, apart from option keys. */
    fieldsOf(info: OcrProviderInfo) { return info.uses.filter(u => !u.startsWith('options:')); }

    edit(row: OcrConfigRow) {
        const info = this.info(row.provider);
        if (!info) { return; }
        this.open(info, {
            countryCode: row.countryCode, provider: row.provider, isEnabled: row.isEnabled, priority: row.priority, useForComparison: row.useForComparison,
            endpoint: row.endpoint, model: row.model, extractModel: row.extractModel, region: row.region, options: {...row.options}, secret: null,
            maxPages: row.maxPages, concurrency: row.concurrency, timeoutSeconds: row.timeoutSeconds, notes: row.notes
        }, row.hasSecret, row.secretHint, false);
    }

    /** A new row: from the * row of that provider when one exists, so a country starts from the default. */
    add(info: OcrProviderInfo) {
        const base = this.data?.rows.find(r => r.countryCode === '*' && r.provider === info.code);
        this.open(info, {
            countryCode: this.country, provider: info.code, isEnabled: base?.isEnabled ?? false, priority: base?.priority ?? 50, useForComparison: base?.useForComparison ?? false,
            endpoint: base?.endpoint ?? info.defaultEndpoint, model: base?.model ?? info.defaultModel, extractModel: base?.extractModel ?? null, region: base?.region ?? null,
            options: {...(base?.options ?? {})}, secret: null, maxPages: base?.maxPages ?? 50, concurrency: base?.concurrency ?? 4, timeoutSeconds: base?.timeoutSeconds ?? 120, notes: null
        }, false, null, true);
    }

    private open(info: OcrProviderInfo, model: OcrConfigInput, hasSecret: boolean, secretHint: string | null, isNew: boolean) {
        const options = info.uses.filter(u => u.startsWith('options:')).map(u => u.substring(8)).map(key => ({key, value: model.options[key] ?? ''}));
        this.formError = null;
        this.editing = {info, model, options, hasSecret, secretHint, removeSecret: false, isNew};
    }

    save() {
        const e = this.editing;
        if (!e) { return; }
        const m = e.model;
        const body: OcrConfigInput = {
            ...m, priority: +m.priority || 0, maxPages: +m.maxPages || 50, concurrency: +m.concurrency || 4, timeoutSeconds: +m.timeoutSeconds || 120,
            options: Object.fromEntries(e.options.filter(o => (o.value ?? '').trim()).map(o => [o.key, o.value.trim()])),
            secret: e.removeSecret ? '' : (m.secret ?? '').trim() ? m.secret!.trim() : null
        };
        this.saving = true;
        this.formError = null;
        this.api.save(body).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => {
                this.alerts.showMessage('OCR providers', `${r.label} saved for ${r.countryCode === '*' ? 'every country' : r.countryCode}.`, MessageSeverity.success);
                this.editing = null;
                this.load();
            },
            error: err => this.formError = ocrErrorOf(err, 'The configuration could not be saved.')
        });
    }

    remove(row: OcrConfigRow) {
        const where = row.countryCode === '*' ? 'every country (countries without their own row fall back to the built-in default)' : `${row.countryCode} (it falls back to the * row)`;
        if (!confirm(`Remove ${row.label} for ${where}? Its key is deleted.`)) { return; }
        this.api.remove(row.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => this.load(),
            error: e => this.alerts.showMessage('OCR providers', ocrErrorOf(e, 'It could not be removed.'), MessageSeverity.error)
        });
    }

    trackRow = (_: number, r: OcrConfigRow) => r.id;
}
