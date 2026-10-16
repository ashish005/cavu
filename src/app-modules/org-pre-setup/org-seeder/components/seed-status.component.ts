import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {EMPTY, Subject, catchError, switchMap, takeUntil, takeWhile, timer} from "rxjs";
import {BranchSeedStatus, OrgSettingService, SeedStatus, errorMessageOf} from "../services/org-setting.service";

const POLL_INTERVAL_MS = 3000;
const TERMINAL: ReadonlyArray<SeedStatus> = ['Completed', 'Failed'];
const STAGES: ReadonlyArray<{key: SeedStatus; label: string}> = [
    {key: 'Pending', label: 'Requested'},
    {key: 'Queued', label: 'Queued'},
    {key: 'Processing', label: 'Seeding'},
    {key: 'Completed', label: 'Done'}
];

/**
 * Live seed state of a branch. Polls `GET v1/seed/{branchId}/status` until the seed
 * is Completed or Failed; call `restart()` after re-queueing to resume polling.
 */
@Component({
    standalone: false,
    selector: 'seed-status',
    templateUrl: './templates/seed-status.html',
    styleUrls: ['./templates/seed-status.css'],
    providers: [OrgSettingService]
})
export class SeedStatusComponent implements OnChanges, OnDestroy {
    @Input() branchId: string | null = null;
    @Input() allowRetry = false;
    @Input() retrying = false;
    @Output() statusChange = new EventEmitter<BranchSeedStatus>();
    @Output() retry = new EventEmitter<void>();

    readonly stages = STAGES;
    status: BranchSeedStatus | null = null;
    error: string | null = null;
    polling = false;

    private restart$ = new Subject<void>();
    private destroy$ = new Subject<void>();

    constructor(private service: OrgSettingService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['branchId']) { this.restart(); }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    restart() {
        this.restart$.next();
        if (!this.branchId) { return; }
        const branchId = this.branchId;
        this.polling = true;

        timer(0, POLL_INTERVAL_MS).pipe(
            // A failed poll (network blip, 5xx) is shown but does not stop polling.
            switchMap(() => this.service.getSeedStatus(branchId).pipe(
                catchError(err => {
                    this.error = errorMessageOf(err, 'Could not load seed status.');
                    return EMPTY;
                })
            )),
            takeWhile(s => !TERMINAL.includes(s.status), true),
            takeUntil(this.restart$),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (s) => {
                this.error = null;
                this.status = s;
                this.statusChange.emit(s);
            },
            complete: () => this.polling = false
        });
    }

    get isFailed() { return this.status?.status === 'Failed'; }
    get isCompleted() { return this.status?.status === 'Completed'; }

    /** Pending with no request means the branch has never been asked to seed. */
    get notRequested() { return this.status?.status === 'Pending' && !this.status.requestedAt; }

    get stageIndex(): number {
        return this.status ? STAGES.findIndex(s => s.key === this.status!.status) : -1;
    }

    stageClass(i: number): string {
        if (this.isFailed) { return i === 0 ? 'done' : 'todo'; }
        if (i < this.stageIndex || this.isCompleted) { return 'done'; }
        if (i === this.stageIndex) { return this.notRequested ? 'todo' : 'active'; }
        return 'todo';
    }
}
