import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subject, catchError, debounceTime, finalize, forkJoin, of, switchMap} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {NotificationApiService, notifyErrorOf} from "../notification-api.service";
import {
    CHANNEL_ICON, CHANNEL_LABEL, ChannelStatus, MODE_LABEL, NotifyChannel, NotifyKind, NotifyKindInput, NotifyMode, NotifyPreview, NotifyTemplateInput
} from "../notification.models";

/**
 * Everything the application sends, by area: switch each on or off, pick its channels, say whether people may switch
 * channels off for themselves, edit the wording (task notifications) and send yourself a test. Changes save at once.
 */
@Component({standalone: false, templateUrl: './templates/kinds.html'})
export class NotifyKindsView implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly preview$ = new Subject<void>();
    readonly channelLabel = CHANNEL_LABEL;
    readonly icon = CHANNEL_ICON;
    readonly modeLabel = MODE_LABEL;
    readonly modes = Object.keys(MODE_LABEL) as NotifyMode[];
    readonly integrationsUrl = '/app/admin/setup/integrations/messaging';

    kinds: NotifyKind[] = [];
    /** Grouped once per change: a getter building new groups each render makes ngFor rebuild the rows (and their ngModels) forever. */
    areas: {area: string; kinds: NotifyKind[]}[] = [];
    channels: ChannelStatus[] = [];
    loading = false;
    error: string | null = null;
    /** Kinds being saved (controls disabled meanwhile). */
    readonly saving = new Set<string>();
    testing: string | null = null;

    /** The wording editor. */
    editor: {kind: NotifyKind; channel: NotifyChannel; model: NotifyTemplateInput; isCustomised: boolean; loading: boolean; error: string | null} | null = null;
    preview: NotifyPreview | null = null;

    constructor(private api: NotificationApiService, private alerts: AlertService) {}

    ngOnInit() {
        this.load();
        this.preview$.pipe(
            debounceTime(350),
            switchMap(() => {
                const e = this.editor;
                return e ? this.api.preview(e.kind.code, e.channel, e.model).pipe(catchError(() => of(null))) : of(null);
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(p => this.preview = p);
    }

    load() {
        this.loading = true;
        this.error = null;
        forkJoin({kinds: this.api.kinds(), channels: this.api.channels()}).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: r => { this.kinds = r.kinds; this.channels = r.channels; this.regroup(); },
            error: e => this.error = notifyErrorOf(e, 'Notifications could not be loaded.')
        });
    }

    private regroup() {
        const map = new Map<string, NotifyKind[]>();
        this.kinds.forEach(k => map.set(k.area, [...(map.get(k.area) ?? []), k]));
        this.areas = [...map.entries()].map(([area, kinds]) => ({area, kinds}));
    }

    trackByArea(_: number, a: {area: string}) { return a.area; }

    ready(channel: NotifyChannel) { return this.channels.find(c => c.channel === channel)?.configured ?? channel === 'InApp'; }
    /** Every chosen channel is set up (nothing will fail for want of a provider). */
    allReady(k: NotifyKind) { return this.enabledChannels(k).every(c => this.ready(c)); }
    enabledChannels(k: NotifyKind) { return k.channels.filter(c => c.isEnabled).map(c => c.channel); }
    trackByCode(_: number, k: NotifyKind) { return k.code; }

    // ---------- Settings (saved at once) ----------

    toggle(k: NotifyKind) { this.save(k, {isEnabled: !k.isEnabled}); }

    flipChannel(k: NotifyKind, channel: NotifyChannel) {
        const on = this.enabledChannels(k);
        const next = on.includes(channel) ? on.filter(c => c !== channel) : [...on, channel];
        if (!next.length) { this.alerts.showMessage('Notifications', 'Keep at least one channel, or switch the notification off.', MessageSeverity.warn); return; }
        this.save(k, {channels: next});
    }

    setMode(k: NotifyKind, mode: NotifyMode) { this.save(k, {mode}); }

    private save(k: NotifyKind, change: Partial<NotifyKindInput>) {
        const body: NotifyKindInput = {isEnabled: k.isEnabled, mode: k.mode, channels: this.enabledChannels(k), ...change};
        this.saving.add(k.code);
        this.api.saveKind(k.code, body).pipe(finalize(() => this.saving.delete(k.code)), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: saved => { const i = this.kinds.findIndex(x => x.code === k.code); if (i >= 0) { this.kinds[i] = saved; this.regroup(); } },
            error: e => this.alerts.showMessage('Notifications', notifyErrorOf(e, 'The change could not be saved.'), MessageSeverity.error)
        });
    }

    // ---------- Test ----------

    test(k: NotifyKind, channel: NotifyChannel) {
        this.testing = `${k.code}:${channel}`;
        this.api.test(k.code, channel).pipe(finalize(() => this.testing = null), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: m => this.alerts.showMessage('Test sent', m, MessageSeverity.success),
            error: e => this.alerts.showMessage('Test', notifyErrorOf(e, 'The test could not be sent.'), MessageSeverity.error)
        });
    }

    // ---------- Wording ----------

    openEditor(k: NotifyKind, channel?: NotifyChannel) {
        const c = channel ?? this.enabledChannels(k)[0] ?? 'InApp';
        this.preview = null;
        this.editor = {kind: k, channel: c, model: {subject: null, body: '', isHtml: false}, isCustomised: false, loading: true, error: null};
        const e = this.editor;
        this.api.template(k.code, c).pipe(finalize(() => e.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: t => { e.model = {subject: t.subject, body: t.body, isHtml: t.isHtml}; e.isCustomised = t.isCustomised; this.preview$.next(); },
            error: err => e.error = notifyErrorOf(err, 'The wording could not be loaded.')
        });
    }

    /** Channels to edit: the enabled ones first, then the rest. */
    editorChannels(k: NotifyKind): NotifyChannel[] {
        const on = this.enabledChannels(k);
        return [...on, ...k.channels.map(c => c.channel).filter(c => !on.includes(c))];
    }

    token(field: string) { return `{{${field}}}`; }
    hasSubject(c: NotifyChannel) { return c !== 'Sms' && c !== 'WhatsApp'; }
    subjectLabel(c: NotifyChannel) { return c === 'Email' ? 'Subject' : 'Title'; }
    changed() { this.preview$.next(); }

    insert(field: string, el: HTMLTextAreaElement) {
        const e = this.editor;
        if (!e) { return; }
        const token = `{{${field}}}`;
        const at = el.selectionStart ?? e.model.body.length;
        e.model.body = e.model.body.slice(0, at) + token + e.model.body.slice(el.selectionEnd ?? at);
        this.changed();
    }

    saveTemplate() {
        const e = this.editor;
        if (!e) { return; }
        if (!(e.model.body ?? '').trim()) { e.error = 'Write the message.'; return; }
        e.loading = true;
        e.error = null;
        this.api.saveTemplate(e.kind.code, e.channel, e.model).pipe(finalize(() => e.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: t => { e.isCustomised = t.isCustomised; this.alerts.showMessage('Saved', `${this.channelLabel[e.channel]} wording saved.`, MessageSeverity.success); },
            error: err => e.error = notifyErrorOf(err, 'The wording could not be saved.')
        });
    }

    resetTemplate() {
        const e = this.editor;
        if (!e || !confirm('Go back to the standard wording for this channel?')) { return; }
        e.loading = true;
        this.api.resetTemplate(e.kind.code, e.channel).pipe(finalize(() => e.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: t => { e.model = {subject: t.subject, body: t.body, isHtml: t.isHtml}; e.isCustomised = t.isCustomised; this.changed(); },
            error: err => e.error = notifyErrorOf(err, 'The wording could not be reset.')
        });
    }
}
