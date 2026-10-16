import {Component, DestroyRef, Directive, OnInit, TemplateRef, ViewChild, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {
    Branding, BrandingSlot, Feature, FeaturesRes, MONTHS, OrgProfile, OrgProfileRes, OrgSettings, OrgSettingsRes, WEEK_DAYS
} from "../domains/org-admin.models";
import {OrgAdminApiService, errorMessageOf} from "../services/org-admin-api.service";

/** Shared state of the single-form pages: loading, saving, error, and the layout's title/action templates. */
@Directive()
abstract class OrgPage {
    @ViewChild('actionTemplate', {static: true}) actionTemplate!: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', {static: true}) pageTitleTemplate!: TemplateRef<any>;
    protected readonly destroyRef = inject(DestroyRef);
    protected readonly api = inject(OrgAdminApiService);
    protected readonly alerts = inject(AlertService);
    loading = false;
    saving = false;
    error: string | null = null;

    protected saved(message: string) { this.alerts.showMessage('Saved', message, MessageSeverity.success); }
}

@Component({standalone: false, templateUrl: './templates/profile.html'})
export class OrgProfileView extends OrgPage implements OnInit {
    res: OrgProfileRes | null = null;
    model: OrgProfile | null = null;

    ngOnInit() {
        this.loading = true;
        this.api.profile().pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.res = r; this.model = {...r.profile}; },
            error: e => this.error = errorMessageOf(e, 'The profile could not be loaded.')
        });
    }

    save() {
        if (!this.model?.name?.trim()) { this.error = 'Enter the organisation name.'; return; }
        this.saving = true;
        this.error = null;
        this.api.saveProfile(this.model).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.res = r; this.model = {...r.profile}; this.saved('Organisation profile updated.'); },
            error: e => this.error = errorMessageOf(e, 'The profile could not be saved.')
        });
    }
}

@Component({standalone: false, templateUrl: './templates/settings.html'})
export class OrgSettingsView extends OrgPage implements OnInit {
    readonly months = MONTHS;
    readonly weekDays = WEEK_DAYS;
    readonly separators = [{value: '/', name: 'Slash ( / )'}, {value: '-', name: 'Dash ( - )'}, {value: '.', name: 'Dot ( . )'}, {value: ' ', name: 'Space'}];
    res: OrgSettingsRes | null = null;
    model: OrgSettings | null = null;
    zoneFilter = '';

    ngOnInit() {
        this.loading = true;
        this.api.settings().pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => this.apply(r),
            error: e => this.error = errorMessageOf(e, 'The settings could not be loaded.')
        });
    }

    /** Time zones matching the filter, always keeping the chosen one. */
    get zones() {
        const all = this.res?.timeZones ?? [];
        const q = this.zoneFilter.trim().toLowerCase();
        return q ? all.filter(z => z.id === this.model?.timeZone || z.name.toLowerCase().includes(q)) : all;
    }

    /** Today in the chosen format, so the choice is easy to judge. */
    get preview(): string {
        if (!this.model) { return ''; }
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const map: Record<string, string> = {
            yyyy: String(now.getFullYear()), MMMM: MONTHS[now.getMonth()], MMM: MONTHS[now.getMonth()].slice(0, 3),
            MM: pad(now.getMonth() + 1), dd: pad(now.getDate()), d: String(now.getDate())
        };
        return this.model.dateFormat.replace(/yyyy|MMMM|MMM|MM|dd|d/g, t => map[t]);
    }

    save() {
        if (!this.model) { return; }
        this.saving = true;
        this.error = null;
        this.api.saveSettings(this.model).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.apply(r); this.saved('Regional settings updated. Members see them after reloading the app.'); },
            error: e => this.error = errorMessageOf(e, 'The settings could not be saved.')
        });
    }

    private apply(r: OrgSettingsRes) { this.res = r; this.model = {...r.settings}; }
}

interface SlotDef { slot: BrandingSlot; key: 'logo' | 'favicon' | 'loginImage'; title: string; hint: string; accept: string; }

@Component({standalone: false, templateUrl: './templates/branding.html'})
export class OrgBrandingView extends OrgPage implements OnInit {
    readonly slots: SlotDef[] = [
        {slot: 'logo', key: 'logo', title: 'Logo', hint: 'Shown in the app header, on documents and emails. PNG, JPEG or WebP, up to 2 MB; a wide image on a transparent background works best.', accept: '.png,.jpg,.jpeg,.webp'},
        {slot: 'favicon', key: 'favicon', title: 'Browser icon', hint: 'The small icon in the browser tab. Square PNG or ICO, up to 512 KB.', accept: '.png,.ico,.jpg,.jpeg,.webp'},
        {slot: 'login-image', key: 'loginImage', title: 'Login image', hint: 'Shown beside the sign-in form. PNG, JPEG or WebP, up to 5 MB.', accept: '.png,.jpg,.jpeg,.webp'}
    ];
    branding: Branding | null = null;
    primary = '';
    accent = '';
    uploading: BrandingSlot | null = null;

    ngOnInit() {
        this.loading = true;
        this.api.branding().pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: b => this.apply(b),
            error: e => this.error = errorMessageOf(e, 'The branding could not be loaded.')
        });
    }

    image(def: SlotDef) { return this.branding?.[def.key] ?? null; }
    url(def: SlotDef) { return this.api.assetUrl(this.image(def)?.id); }
    size(bytes: number) { return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`; }

    upload(def: SlotDef, input: HTMLInputElement) {
        const file = input.files?.[0];
        input.value = '';
        if (!file) { return; }
        this.uploading = def.slot;
        this.error = null;
        this.api.uploadImage(def.slot, file).pipe(finalize(() => this.uploading = null), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: b => { this.apply(b); this.saved(`${def.title} updated.`); },
            error: e => this.error = errorMessageOf(e, `The ${def.title.toLowerCase()} could not be uploaded.`)
        });
    }

    remove(def: SlotDef) {
        if (!confirm(`Remove the ${def.title.toLowerCase()}?`)) { return; }
        this.api.removeImage(def.slot).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: b => this.apply(b),
            error: e => this.error = errorMessageOf(e, 'The image could not be removed.')
        });
    }

    saveColors() {
        const valid = (c: string) => !c || /^#[0-9a-fA-F]{6}$/.test(c);
        if (!valid(this.primary) || !valid(this.accent)) { this.error = 'Colours must be #RRGGBB, e.g. #2563EB.'; return; }
        this.saving = true;
        this.error = null;
        this.api.saveColors(this.primary || null, this.accent || null).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: b => { this.apply(b); this.saved('Brand colours updated.'); },
            error: e => this.error = errorMessageOf(e, 'The colours could not be saved.')
        });
    }

    private apply(b: Branding) {
        this.branding = b;
        this.primary = b.colors.primaryColor ?? '';
        this.accent = b.colors.accentColor ?? '';
    }
}

@Component({standalone: false, templateUrl: './templates/features.html'})
export class OrgFeaturesView extends OrgPage implements OnInit {
    res: FeaturesRes | null = null;
    groups: {name: string; features: Feature[]}[] = [];
    busy: string | null = null;

    ngOnInit() {
        this.loading = true;
        this.api.features().pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => this.apply(r),
            error: e => this.error = errorMessageOf(e, 'The features could not be loaded.')
        });
    }

    toggle(f: Feature) {
        this.busy = f.code;
        this.error = null;
        this.api.setFeature(f.code, !f.enabled).pipe(finalize(() => this.busy = null), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.apply(r); this.saved(`${f.name} turned ${f.enabled ? 'off' : 'on'}.`); },
            error: e => this.error = errorMessageOf(e, 'The feature could not be changed.')
        });
    }

    private apply(r: FeaturesRes) {
        this.res = r;
        const names = [...new Set(r.features.map(f => f.group))];
        this.groups = names.map(name => ({name, features: r.features.filter(f => f.group === name)}));
    }
}
