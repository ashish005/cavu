import {Inject, Injectable, NgZone} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {BehaviorSubject} from "rxjs";
import {OrgTheme} from "../domains/theme-setup.serializer";
import {ColorOptions, LayoutOptions} from "../domains/theme-config";

/** One appearance, as stored by the API (`v1/appearance`). */
export interface Appearance {
    /** light, dark, or auto (follows the device). */
    mode: 'light' | 'dark' | 'auto';
    /** Colour style code (default, ocean, slate…). */
    style: string;
    cardHeaders: 'plain' | 'coloured';
    font: string;
    fontScale: 'sm' | 'md' | 'lg';
    fixedAside: boolean;
    fixedContent: boolean;
    foldedAside: boolean;
    boxed: boolean;
}

export interface AppearanceStyle { code: string; name: string; swatch: string; accent: string; href: string | null; }
export interface AppearanceFont { code: string; name: string; stack: string; }

export const DEFAULT_APPEARANCE: Appearance = {
    mode: 'light', style: 'default', cardHeaders: 'plain', font: 'system', fontScale: 'md',
    fixedAside: true, fixedContent: true, foldedAside: false, boxed: false
};

/** Built-in catalog, used until (or if) the API's catalog arrives. Kept in step with AppearanceCatalogs in the API. */
export const APPEARANCE_STYLES: AppearanceStyle[] = [
    {code: 'default', name: 'Navy (default)', swatch: '#26437d', accent: '#2196f3', href: null},
    {code: 'ocean', name: 'Ocean', swatch: '#1d4ed8', accent: '#0ea5e9', href: 'ocean.css'},
    {code: 'slate', name: 'Slate', swatch: '#334155', accent: '#64748b', href: 'slate.css'},
    {code: 'forest', name: 'Forest', swatch: '#15803d', accent: '#65a30d', href: 'forest.css'},
    {code: 'plum', name: 'Plum', swatch: '#7c3aed', accent: '#c026d3', href: 'plum.css'},
    {code: 'accent', name: 'Indigo', swatch: '#6284f3', accent: '#907eec', href: 'accent.css'},
    {code: 'warn', name: 'Violet', swatch: '#907eec', accent: '#6284f3', href: 'warn.css'},
    {code: 'info', name: 'Teal', swatch: '#14baa8', accent: '#14baa8', href: 'info.css'},
    {code: 'success', name: 'Green', swatch: '#22b66e', accent: '#22b66e', href: 'success.css'},
    {code: 'warning', name: 'Amber', swatch: '#fdab29', accent: '#fdab29', href: 'warning.css'},
    {code: 'danger', name: 'Rose', swatch: '#ea2e49', accent: '#ea2e49', href: 'danger.css'},
    {code: 'primary', name: 'Crimson', swatch: '#8b0000', accent: '#53a6fa', href: 'primary.css'},
    {code: 'black', name: 'Midnight', swatch: '#1e2835', accent: '#2b2b2b', href: 'black.css'}
];

export const APPEARANCE_FONTS: AppearanceFont[] = [
    {code: 'system', name: 'System', stack: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'},
    {code: 'verdana', name: 'Verdana', stack: 'Verdana, Geneva, Tahoma, sans-serif'},
    {code: 'trebuchet', name: 'Trebuchet', stack: '"Trebuchet MS", "Lucida Grande", sans-serif'},
    {code: 'serif', name: 'Serif', stack: 'Georgia, "Times New Roman", Times, serif'}
];

const STORAGE_KEY = 'app-appearance';
/** Ids the earlier switcher stored as `name` (colour theme ids). */
const LEGACY_STYLE_IDS: Record<string, string> = {
    '1': 'default', '107': 'black', '100': 'primary', '101': 'accent', '102': 'warn', '103': 'info', '104': 'success', '105': 'warning', '106': 'danger'
};

/**
 * Applies an appearance to the page: light/dark (or following the device), colour style stylesheet, plain or coloured
 * card headers, font, text size and layout. The last applied appearance is kept in localStorage so the next load paints
 * the right theme before the API answers.
 */
@Injectable({providedIn: 'root'})
export class ThemeManagerService {
    /** Kept for older callers. */
    defaultTheme: OrgTheme = <OrgTheme>{code: 'light', isBoxedLayout: false, isFixedAside: true, isFixedContent: true, isFoldedAside: false, isFullscreen: false, name: '1'};
    selectedBaseThemeOption: string = 'light';
    selectedThemeOption: string;
    public showThemeSetting = false;
    public toggleThemeSwitcher() { this.showThemeSetting = !this.showThemeSetting; }

    styles: AppearanceStyle[] = APPEARANCE_STYLES;
    fonts: AppearanceFont[] = APPEARANCE_FONTS;

    /** What is on screen now (a preview while the Appearance panel is open). */
    readonly current$ = new BehaviorSubject<Appearance>(DEFAULT_APPEARANCE);
    /** What was last saved or loaded; previews return to it. */
    private committed: Appearance = DEFAULT_APPEARANCE;
    private readonly darkQuery = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;

    constructor(@Inject(DOCUMENT) private document: Document, private zone: NgZone) {
        // Paint the last known appearance at once.
        const cached = this.readCache();
        if (cached) { this.commit(cached, false); }
        // "Auto" follows the device when it switches.
        this.darkQuery?.addEventListener?.('change', () => this.zone.run(() => { if (this.current$.value.mode === 'auto') { this.paint(this.current$.value); } }));
    }

    get current(): Appearance { return this.current$.value; }
    get isDark(): boolean { return this.resolveMode(this.current.mode) === 'dark'; }

    /** Accepts the API's appearance, the earlier OrgTheme shape, or nothing (the default). */
    normalise(input: any): Appearance {
        const t = input ?? {};
        const legacyMode = t.code === 'dark' || t.code === 'light' ? t.code : null;
        const mode = ['light', 'dark', 'auto'].includes(t.mode) ? t.mode : legacyMode ?? 'light';
        const legacyStyle = t.name != null ? LEGACY_STYLE_IDS[String(t.name)] : null;
        const style = this.styles.some(s => s.code === t.style) ? t.style : legacyStyle ?? 'default';
        return {
            mode,
            style,
            cardHeaders: t.cardHeaders === 'coloured' ? 'coloured' : 'plain',
            font: this.fonts.some(f => f.code === t.font) ? t.font : 'system',
            fontScale: ['sm', 'md', 'lg'].includes(t.fontScale) ? t.fontScale : 'md',
            fixedAside: t.fixedAside ?? t.isFixedAside ?? true,
            fixedContent: t.fixedContent ?? t.isFixedContent ?? true,
            foldedAside: t.foldedAside ?? t.isFoldedAside ?? false,
            boxed: t.boxed ?? t.isBoxedLayout ?? false
        };
    }

    /** Applies and remembers it (from the API, or after saving). */
    commit(input: any, cache = true) {
        const a = this.normalise(input);
        this.committed = a;
        this.paint(a);
        if (cache) { this.writeCache(a); }
    }

    /** Shows it without remembering (live preview). */
    preview(input: Partial<Appearance>) { this.paint(this.normalise({...this.current, ...input})); }

    /** Back to the last committed appearance (preview cancelled). */
    revert() { this.paint(this.committed); }

    /**
     * The app setup's theme (the organisation default, before sign-in). A member's own appearance cached from an earlier
     * visit wins until `v1/appearance/me` answers, so their theme does not flash back to the organisation's.
     */
    applySetting(opt: any) {
        if (this.readCache()) { return; }
        this.commit(opt ?? DEFAULT_APPEARANCE, false);
    }

    /** Older callers: a colour theme by its earlier numeric id. */
    getThemeByID(id: number | string) {
        const code = LEGACY_STYLE_IDS[String(id)] ?? 'default';
        return this.styles.find(s => s.code === code);
    }
    installTheme(theme?: AppearanceStyle | null) { this.installStyle(theme ?? null); }

    private paint(a: Appearance) {
        const body = this.document.body;
        const html = this.document.documentElement;
        const switching = this.current$.value.mode !== a.mode;
        if (switching) { body.classList.add('theme-switching'); setTimeout(() => body.classList.remove('theme-switching'), 300); }

        const mode = this.resolveMode(a.mode);
        body.classList.remove('light', 'dark');
        body.classList.add(mode);
        html.style.colorScheme = mode;
        this.selectedBaseThemeOption = mode;

        body.classList.toggle('cards-plain', a.cardHeaders === 'plain');
        body.classList.toggle('fixed-aside', a.fixedAside);
        body.classList.toggle('fixed-content', a.fixedContent);
        body.classList.toggle('container', a.boxed);
        this.toggleWhenReady('#aside', 'folded', a.foldedAside);

        ['fs-sm', 'fs-md', 'fs-lg'].forEach(c => html.classList.remove(c));
        html.classList.add(`fs-${a.fontScale}`);
        body.style.setProperty('--app-font', this.fonts.find(f => f.code === a.font)?.stack ?? APPEARANCE_FONTS[0].stack);

        this.installStyle(this.styles.find(s => s.code === a.style) ?? null);
        this.selectedThemeOption = a.style;
        this.current$.next(a);
    }

    private resolveMode(mode: Appearance['mode']): 'light' | 'dark' {
        return mode === 'auto' ? (this.darkQuery?.matches ? 'dark' : 'light') : mode;
    }

    /** The sidebar may not exist yet on first load; retry briefly. */
    private toggleWhenReady(selector: string, cls: string, on: boolean, attempts = 20) {
        const el = this.document.querySelector(selector);
        if (el) { el.classList.toggle(cls, on); return; }
        if (attempts > 0) { setTimeout(() => this.toggleWhenReady(selector, cls, on, attempts - 1), 150); }
    }

    private installStyle(style: AppearanceStyle | null) {
        const existing = this.document.head.querySelector('link[rel="stylesheet"].style-manager-theme');
        if (!style?.href) { existing?.remove(); return; }
        const link = existing ?? this.document.createElement('link');
        if (!existing) {
            link.setAttribute('rel', 'stylesheet');
            link.classList.add('style-manager-theme');
            this.document.head.appendChild(link);
        }
        const href = `assets/themes/${style.href}`;
        if (link.getAttribute('href') !== href) { link.setAttribute('href', href); }
    }

    private readCache(): Appearance | null {
        try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? this.normalise(JSON.parse(raw)) : null; } catch { return null; }
    }
    private writeCache(a: Appearance) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); } catch { /* private mode */ }
    }

    // Kept for older templates.
    layouts: Array<LayoutOptions> = [];
    themesOptions: Array<ColorOptions> = [
        new ColorOptions({displayName: 'Light', class: 'light', value: 'light'}),
        new ColorOptions({displayName: 'Dark', class: 'dark', value: 'dark'})
    ];
    get themes() { return this.styles.map(s => ({id: s.code, name: s.name, class: s.code})); }
    updateThemeColor(_: any) {}
    updateLayout(_: any) {}
}
