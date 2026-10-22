import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {NotificationApiService, notifyErrorOf} from "../notification-api.service";
import {CHANNEL_ICON, CHANNEL_LABEL, MyPreference} from "../notification.models";

/** Your own notifications: switch channels off where your organisation lets you. */
@Component({standalone: false, templateUrl: './templates/my-preferences.html'})
export class NotifyMyPreferencesView implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    readonly channelLabel = CHANNEL_LABEL;
    readonly icon = CHANNEL_ICON;
    items: MyPreference[] = [];
    /** Grouped once per load (see NotifyKindsView.areas). */
    areas: {area: string; items: MyPreference[]}[] = [];
    loading = false;
    saving = false;
    dirty = false;
    error: string | null = null;

    constructor(private api: NotificationApiService, private alerts: AlertService) {}

    ngOnInit() {
        this.loading = true;
        this.api.myPreferences().pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: p => this.set(p),
            error: e => this.error = notifyErrorOf(e, 'Your notifications could not be loaded.')
        });
    }

    private set(items: MyPreference[]) {
        this.items = items;
        const map = new Map<string, MyPreference[]>();
        items.forEach(i => map.set(i.area, [...(map.get(i.area) ?? []), i]));
        this.areas = [...map.entries()].map(([area, list]) => ({area, items: list}));
    }

    trackByArea(_: number, a: {area: string}) { return a.area; }
    trackByCode(_: number, i: MyPreference) { return i.code; }

    save() {
        this.saving = true;
        this.error = null;
        const body = this.items.filter(i => !i.locked).flatMap(i => i.channels.map(c => ({code: i.code, channel: c.channel, isEnabled: c.isEnabled})));
        this.api.saveMyPreferences(body).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: p => { this.set(p); this.dirty = false; this.alerts.showMessage('Saved', 'Your notification choices are saved.', MessageSeverity.success); },
            error: e => this.error = notifyErrorOf(e, 'Your choices could not be saved.')
        });
    }
}
