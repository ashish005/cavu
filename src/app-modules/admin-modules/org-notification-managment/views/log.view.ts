import {Component, DestroyRef, OnInit, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AlertService, FullDateFormatCell, MessageSeverity, ViewExtender} from "@app-global";
import {NotificationApiService, NotifyGridEvents, NotifyLogGridService, notifyErrorOf} from "../notification-api.service";
import {NotifyActionsCell, NotifyChannelsCell, NotifyStatusCell} from "../notification-cells";
import {CHANNEL_LABEL, NotifyChannel, NotifyKind, NotifyLogQueryOptions, NotifyLogRow, STATUS_LABEL, STATUS_TONE} from "../notification.models";

/** Every notification sent: to whom, on which channels, the result, and the reason for failures; failed ones can be sent again. */
@Component({standalone: false, templateUrl: './templates/log.html'})
export class NotifyLogView extends ViewExtender<NotifyLogRow> implements OnInit {
    override coreState = new NotifyLogQueryOptions();
    private readonly destroyRef = inject(DestroyRef);
    readonly channels = Object.keys(CHANNEL_LABEL) as NotifyChannel[];
    readonly channelLabel = CHANNEL_LABEL;
    readonly statusLabel = STATUS_LABEL;
    readonly tone = STATUS_TONE;
    kinds: NotifyKind[] = [];
    detail: NotifyLogRow | null = null;

    constructor(public override service: NotifyLogGridService, public override activatedRoute: ActivatedRoute, private api: NotificationApiService,
                private events: NotifyGridEvents, private alerts: AlertService) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'When', field: 'createdAt', cellTemplate: FullDateFormatCell},
            {headerName: 'Notification', field: 'kind'},
            {headerName: 'To', field: 'recipient'},
            {headerName: 'Channels', field: 'deliveries', cellTemplate: NotifyChannelsCell},
            {headerName: 'Result', field: 'status', cellTemplate: NotifyStatusCell},
            {headerName: '', field: 'id', cellTemplate: NotifyActionsCell}
        ];
        this.coreState.take = 25;
    }

    get errorText() { return this.errorMsg ? notifyErrorOf(this.errorMsg, 'The log could not be loaded.') : null; }

    ngOnInit() {
        this.coreState.status = (this.activatedRoute.snapshot.queryParamMap.get('status') as any) || null;
        this.api.kinds().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({next: k => this.kinds = k, error: () => {}});
        this.events.actions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(a => {
            if (a.action === 'open') { this.detail = a.row; }
            if (a.action === 'retry') { this.retry(a.row); }
        });
        this.populateGrid();
    }

    actionCb(_: any) {}

    search() { this.coreState.skip = 0; this.populateGrid(); }

    retry(r: NotifyLogRow) {
        this.api.retry(r.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: m => { this.alerts.showMessage('Notifications', `${m} They go out within a minute.`, MessageSeverity.success); this.detail = null; this.refreshGrid(); },
            error: e => this.alerts.showMessage('Notifications', notifyErrorOf(e, 'It could not be sent again.'), MessageSeverity.error)
        });
    }

    hasFailed(r: NotifyLogRow) { return r.deliveries.some(d => d.status === 'Failed'); }
}
