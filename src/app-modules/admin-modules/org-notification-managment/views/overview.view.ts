import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize} from "rxjs";
import {AlertService, MessageSeverity} from "@app-global";
import {NotificationApiService, notifyErrorOf} from "../notification-api.service";
import {CHANNEL_ICON, NotifyLogRow, NotifyOverview} from "../notification.models";

/** The last seven days at a glance: what was sent, what failed, which channels are set up, recent failures. */
@Component({standalone: false, templateUrl: './templates/overview.html'})
export class NotifyOverviewView implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    readonly icon = CHANNEL_ICON;
    readonly integrationsUrl = '/app/admin/setup/integrations/messaging';
    data: NotifyOverview | null = null;
    loading = false;
    error: string | null = null;
    retrying: string | null = null;

    constructor(private api: NotificationApiService, private alerts: AlertService) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.error = null;
        this.api.overview().pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: d => this.data = d,
            error: e => this.error = notifyErrorOf(e, 'The overview could not be loaded.')
        });
    }

    failedChannels(r: NotifyLogRow) { return r.deliveries.filter(d => d.status === 'Failed'); }

    retry(r: NotifyLogRow) {
        this.retrying = r.id;
        this.api.retry(r.id).pipe(finalize(() => this.retrying = null), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: m => { this.alerts.showMessage('Notifications', m, MessageSeverity.success); this.load(); },
            error: e => this.alerts.showMessage('Notifications', notifyErrorOf(e, 'It could not be sent again.'), MessageSeverity.error)
        });
    }
}
