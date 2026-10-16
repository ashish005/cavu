import {Component, DestroyRef, EventEmitter, Injectable, Injector, Input, OnInit, Output, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, finalize, map} from "rxjs";
import {CoreEndpointBase} from "../../services/endpoint-base.service";
import {AsidePanelComponent} from "../../components/aside-panel/aside-panel.component";
import {APPEARANCE_FONTS, APPEARANCE_STYLES, Appearance, AppearanceFont, AppearanceStyle, ThemeManagerService} from "./services/theme-manager.service";

export interface AppearanceCatalog { modes: string[]; styles: AppearanceStyle[]; fonts: AppearanceFont[]; fontScales: string[]; }
export interface MyAppearance {
    theme: Appearance;
    /** personal, memberType, organisation or application. */
    source: string;
    sourceName: string | null;
    allowPersonal: boolean;
    hasPersonal: boolean;
    canManage: boolean;
    inheritedTheme: Appearance;
    catalog: AppearanceCatalog;
}

const unwrap = <T>(r: any): T => {
    if (r?.isSuccess === false) { throw {error: r}; }
    return r?.data as T;
};

/** Tenant API `v1/appearance/*` (the member) and `v1/org-admin/appearance/*` (defaults). */
@Injectable({providedIn: 'root'})
export class AppearanceApiService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }
    private url(path: string) { return `${this.baseSectorAPIUrl}/v1/${path}`; }

    mine(): Observable<MyAppearance> { return this.httpClient.get(this.url('appearance/me'), this.requestHeaders).pipe(map(r => unwrap<MyAppearance>(r))); }
    saveMine(theme: Appearance) { return this.httpClient.put(this.url('appearance/me'), theme, this.requestHeaders).pipe(map(r => unwrap<MyAppearance>(r))); }
    resetMine() { return this.httpClient.delete(this.url('appearance/me'), this.requestHeaders).pipe(map(r => unwrap<MyAppearance>(r))); }
    saveDefault(key: string, theme: Appearance, allowPersonal: boolean) {
        return this.httpClient.put(this.url(`org-admin/appearance/${key}`), {theme, allowPersonal}, this.requestHeaders).pipe(map(r => unwrap<any>(r)));
    }
    resetDefault(key: string) { return this.httpClient.delete(this.url(`org-admin/appearance/${key}`), this.requestHeaders).pipe(map(r => unwrap<any>(r))); }
}

/** The appearance options as an editor; used by the member's panel and the administrators' defaults page. */
@Component({
    selector: 'appearance-editor',
    standalone: true,
    imports: [CommonModule],
    styles: [`
        .ap-section { margin-bottom: 1.25rem; }
        .ap-label { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; opacity: .7; margin-bottom: .5rem; }
        .ap-modes { display: grid; grid-template-columns: repeat(3, 1fr); gap: .5rem; }
        .ap-mode { border: 2px solid rgba(120,130,140,.25); border-radius: 10px; padding: .4rem; cursor: pointer; background: transparent; color: inherit; text-align: center; }
        .ap-mode.on { border-color: var(--ap-accent, #2196f3); }
        .ap-mini { height: 54px; border-radius: 6px; overflow: hidden; display: flex; margin-bottom: .35rem; border: 1px solid rgba(120,130,140,.2); }
        .ap-mini .side { width: 26%; } .ap-mini .main { flex: 1; padding: 6px; } .ap-mini .bar { height: 8px; border-radius: 3px; margin-bottom: 5px; }
        .ap-mini .line { height: 5px; border-radius: 3px; margin-bottom: 4px; opacity: .5; }
        .ap-styles { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: .5rem; }
        .ap-style { border: 2px solid transparent; border-radius: 10px; padding: .4rem .3rem; cursor: pointer; background: rgba(120,130,140,.06); color: inherit; font-size: .75rem; text-align: center; }
        .ap-style.on { border-color: var(--ap-accent, #2196f3); }
        .ap-dot { width: 28px; height: 28px; border-radius: 50%; margin: 0 auto .3rem; position: relative; box-shadow: inset 0 0 0 2px rgba(255,255,255,.25); }
        .ap-dot i { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; }
        .ap-seg { display: inline-flex; border: 1px solid rgba(120,130,140,.3); border-radius: 8px; overflow: hidden; }
        .ap-seg button { border: 0; background: transparent; color: inherit; padding: .35rem .8rem; font-size: .85rem; cursor: pointer; }
        .ap-seg button + button { border-left: 1px solid rgba(120,130,140,.3); }
        .ap-seg button.on { background: var(--ap-accent, #2196f3); color: #fff; }
        .ap-switch { display: flex; align-items: center; padding: .45rem 0; border-bottom: 1px solid rgba(120,130,140,.12); cursor: pointer; }
        .ap-switch:last-child { border-bottom: 0; }
        .ap-toggle { width: 34px; height: 20px; border-radius: 10px; background: rgba(120,130,140,.35); position: relative; flex: none; transition: background .15s; }
        .ap-toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: left .15s; }
        .ap-toggle.on { background: var(--ap-accent, #2196f3); } .ap-toggle.on::after { left: 16px; }
    `],
    template: `
        <div [style.--ap-accent]="styleOf(value.style)?.swatch">
            <div class="ap-section">
                <div class="ap-label">Mode</div>
                <div class="ap-modes">
                    <button *ngFor="let m of modes" type="button" class="ap-mode" [class.on]="value.mode === m.code" (click)="set({mode: m.code})">
                        <div class="ap-mini" [style.background]="m.code === 'dark' ? '#1e2835' : '#f9fafc'">
                            <div class="side" [style.background]="m.code === 'dark' ? '#243140' : (m.code === 'auto' ? 'linear-gradient(#fff 50%, #243140 50%)' : '#fff')"></div>
                            <div class="main">
                                <div class="bar" [style.background]="styleOf(value.style)?.swatch"></div>
                                <div class="line" [style.background]="m.code === 'dark' ? '#a0b4c8' : '#465a6e'" style="width: 80%"></div>
                                <div class="line" [style.background]="m.code === 'dark' ? '#a0b4c8' : '#465a6e'" style="width: 55%"></div>
                            </div>
                        </div>
                        <div class="text-sm"><i class="fa mr-1" [ngClass]="m.icon"></i>{{ m.name }}</div>
                    </button>
                </div>
            </div>

            <div class="ap-section">
                <div class="ap-label">Colour style</div>
                <div class="ap-styles">
                    <button *ngFor="let s of styles" type="button" class="ap-style" [class.on]="value.style === s.code" (click)="set({style: s.code})" [title]="s.name">
                        <div class="ap-dot" [style.background]="'linear-gradient(135deg, ' + s.swatch + ' 60%, ' + s.accent + ' 60%)'">
                            <i *ngIf="value.style === s.code" class="fa fa-check"></i></div>
                        {{ s.name }}
                    </button>
                </div>
            </div>

            <div class="ap-section d-flex flex-wrap">
                <div class="mr-4 mb-2">
                    <div class="ap-label">Card headers</div>
                    <div class="ap-seg">
                        <button type="button" [class.on]="value.cardHeaders === 'plain'" (click)="set({cardHeaders: 'plain'})">Plain</button>
                        <button type="button" [class.on]="value.cardHeaders === 'coloured'" (click)="set({cardHeaders: 'coloured'})">Coloured</button>
                    </div>
                </div>
                <div class="mb-2">
                    <div class="ap-label">Text size</div>
                    <div class="ap-seg">
                        <button type="button" [class.on]="value.fontScale === 'sm'" (click)="set({fontScale: 'sm'})" title="Small" style="font-size: .75rem">A</button>
                        <button type="button" [class.on]="value.fontScale === 'md'" (click)="set({fontScale: 'md'})" title="Normal">A</button>
                        <button type="button" [class.on]="value.fontScale === 'lg'" (click)="set({fontScale: 'lg'})" title="Large" style="font-size: 1.05rem">A</button>
                    </div>
                </div>
            </div>

            <div class="ap-section">
                <div class="ap-label">Font</div>
                <div class="ap-seg flex-wrap">
                    <button *ngFor="let f of fonts" type="button" [class.on]="value.font === f.code" (click)="set({font: f.code})" [style.font-family]="f.stack">Aa {{ f.name }}</button>
                </div>
            </div>

            <div class="ap-section">
                <div class="ap-label">Layout</div>
                <div *ngFor="let l of layouts" class="ap-switch" role="switch" [attr.aria-checked]="value[l.key]" (click)="toggle(l.key)">
                    <div class="flex"><div class="text-sm">{{ l.name }}</div><div class="text-xs" style="opacity: .65">{{ l.hint }}</div></div>
                    <span class="ap-toggle" [class.on]="value[l.key]"></span>
                </div>
            </div>
        </div>`
})
export class AppearanceEditorComponent {
    @Input({required: true}) value!: Appearance;
    @Input() styles: AppearanceStyle[] = APPEARANCE_STYLES;
    @Input() fonts: AppearanceFont[] = APPEARANCE_FONTS;
    @Output() valueChange = new EventEmitter<Appearance>();

    readonly modes = [
        {code: 'light' as const, name: 'Light', icon: 'fa-sun-o'},
        {code: 'dark' as const, name: 'Dark', icon: 'fa-moon-o'},
        {code: 'auto' as const, name: 'Auto', icon: 'fa-adjust'}
    ];
    readonly layouts: {key: 'fixedAside' | 'fixedContent' | 'foldedAside' | 'boxed'; name: string; hint: string}[] = [
        {key: 'fixedAside', name: 'Fixed sidebar', hint: 'The menu stays in place while the page scrolls.'},
        {key: 'fixedContent', name: 'Fixed header', hint: 'The top bar stays visible while you scroll.'},
        {key: 'foldedAside', name: 'Compact sidebar', hint: 'Icons only, for more room.'},
        {key: 'boxed', name: 'Boxed layout', hint: 'Content in a centred column on wide screens.'}
    ];

    styleOf(code: string) { return this.styles.find(s => s.code === code); }
    set(change: Partial<Appearance>) { this.valueChange.emit({...this.value, ...change}); }
    toggle(key: 'fixedAside' | 'fixedContent' | 'foldedAside' | 'boxed') { this.set({[key]: !this.value[key]} as Partial<Appearance>); }
}

/**
 * The member's Appearance panel (header wrench). Loads their appearance on sign-in, previews changes live and saves them
 * as their own choice — or explains who sets it when their member type does not allow personal choices.
 */
@Component({
    selector: 'theme-setting',
    standalone: true,
    imports: [CommonModule, RouterModule, AsidePanelComponent, AppearanceEditorComponent],
    template: `
        <app-aside *ngIf="themeManager.showThemeSetting" title="Appearance" [subtitle]="subtitle" (closed)="cancel()">
            <div *ngIf="error" class="alert alert-danger text-sm">{{ error }}</div>
            <div *ngIf="me && !me.allowPersonal" class="alert alert-info text-sm">
                Your organisation sets the appearance for {{ me.sourceName || 'your member type' }}. You can try options here; they last until you reload.
                <a *ngIf="me.canManage" routerLink="/app/admin/setup/org/appearance" (click)="close()">Change the defaults</a>
            </div>
            <appearance-editor *ngIf="draft" [value]="draft" [styles]="me?.catalog?.styles || styles" [fonts]="me?.catalog?.fonts || fonts" (valueChange)="change($event)"></appearance-editor>

            <div aside-footer class="d-flex align-items-center w-100">
                <button *ngIf="me?.hasPersonal" type="button" class="btn btn-sm white mr-auto" [disabled]="saving" (click)="reset()"
                        title="Go back to the default">Use default</button>
                <span class="flex"></span>
                <button type="button" class="btn btn-sm white mr-1" (click)="cancel()">Cancel</button>
                <button *ngIf="me?.allowPersonal !== false" type="button" class="btn btn-sm theme" [disabled]="saving || !dirty" (click)="save()">
                    <i *ngIf="saving" class="fa fa-spinner fa-spin mr-1"></i>Save</button>
            </div>
        </app-aside>`
})
export class AppearancePanelComponent implements OnInit {
    readonly themeManager = inject(ThemeManagerService);
    private readonly api = inject(AppearanceApiService);
    private readonly destroyRef = inject(DestroyRef);
    readonly styles = APPEARANCE_STYLES;
    readonly fonts = APPEARANCE_FONTS;
    me: MyAppearance | null = null;
    draft: Appearance | null = null;
    dirty = false;
    saving = false;
    error: string | null = null;

    get subtitle(): string {
        if (!this.me) { return 'Mode, colours, text and layout'; }
        return this.me.source === 'personal' ? 'Your own choice'
            : this.me.source === 'memberType' ? `Default for ${this.me.sourceName}`
            : this.me.source === 'organisation' ? 'Your organisation\'s default' : 'Standard appearance';
    }

    ngOnInit() {
        // Signed in: apply the member's appearance (own choice, member type or organisation default).
        this.load();
        this.themeManager.current$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => { if (!this.themeManager.showThemeSetting || !this.draft) { this.draft = {...a}; } });
    }

    private load() {
        this.api.mine().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: me => {
                this.me = me;
                if (me.catalog?.styles?.length) { this.themeManager.styles = me.catalog.styles; }
                if (me.catalog?.fonts?.length) { this.themeManager.fonts = me.catalog.fonts; }
                this.themeManager.commit(me.theme);
                this.draft = this.themeManager.normalise(me.theme);
                this.dirty = false;
            },
            error: () => { /* keep the cached appearance */ }
        });
    }

    change(a: Appearance) {
        this.draft = a;
        this.dirty = true;
        this.themeManager.preview(a);
    }

    save() {
        if (!this.draft) { return; }
        this.saving = true;
        this.error = null;
        this.api.saveMine(this.draft).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: me => { this.me = me; this.themeManager.commit(me.theme); this.dirty = false; this.close(); },
            error: e => this.error = e?.error?.message || 'Your appearance could not be saved.'
        });
    }

    reset() {
        this.saving = true;
        this.api.resetMine().pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: me => { this.me = me; this.themeManager.commit(me.theme); this.draft = this.themeManager.normalise(me.theme); this.dirty = false; },
            error: e => this.error = e?.error?.message || 'Could not go back to the default.'
        });
    }

    cancel() {
        if (this.dirty) { this.themeManager.revert(); this.draft = {...this.themeManager.current}; this.dirty = false; }
        this.close();
    }

    close() { this.themeManager.showThemeSetting = false; }
}
