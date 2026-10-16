import {Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Observable, Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap} from "rxjs";

export interface PickerOption { id: string; label: string; sub?: string | null; data?: any; }

/**
 * A search box with a dropdown of matches (customers, vendors, accounts). Shows the chosen option's label; typing
 * searches again after a short pause.
 */
@Component({
    selector: 'fin-picker',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="position-relative">
            <input class="form-control" [class.form-control-sm]="small" [placeholder]="placeholder" [disabled]="disabled"
                   [(ngModel)]="text" (ngModelChange)="terms$.next($event)" (focus)="open()" (blur)="close()" autocomplete="off">
            <div *ngIf="showing" class="dropdown-menu show w-100 p-0" style="max-height: 280px; overflow-y: auto">
                <a *ngFor="let o of options" role="button" class="dropdown-item py-1" (mousedown)="choose(o)">
                    <div>{{ o.label }}</div><div *ngIf="o.sub" class="text-xs text-muted">{{ o.sub }}</div>
                </a>
                <div *ngIf="!options.length" class="dropdown-item text-muted text-sm">{{ loading ? 'Searching…' : 'No matches' }}</div>
            </div>
        </div>`
})
export class FinancePickerComponent implements OnInit {
    @Input() placeholder = 'Search';
    @Input() small = false;
    @Input() disabled = false;
    @Input({required: true}) search!: (term: string | null) => Observable<PickerOption[]>;
    /** Label of the current value (shown until the user types). */
    @Input() set label(value: string | null | undefined) { this.text = value ?? ''; this.chosenLabel = value ?? ''; }
    @Output() picked = new EventEmitter<PickerOption>();

    private readonly destroyRef = inject(DestroyRef);
    readonly terms$ = new Subject<string>();
    text = '';
    chosenLabel = '';
    options: PickerOption[] = [];
    showing = false;
    loading = false;

    ngOnInit() {
        this.terms$.pipe(
            debounceTime(250), distinctUntilChanged(),
            switchMap(term => { this.loading = true; return this.search(term?.trim() || null).pipe(catchError(() => of([] as PickerOption[]))); }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(options => { this.options = options; this.loading = false; this.showing = true; });
    }

    open() {
        this.showing = true;
        if (!this.options.length) { this.loading = true; this.search(null).pipe(catchError(() => of([] as PickerOption[])), takeUntilDestroyed(this.destroyRef)).subscribe(o => { this.options = o; this.loading = false; }); }
    }

    close() { setTimeout(() => { this.showing = false; if (this.text !== this.chosenLabel) { this.text = this.chosenLabel; } }, 150); }

    choose(o: PickerOption) {
        this.text = o.label;
        this.chosenLabel = o.label;
        this.showing = false;
        this.picked.emit(o);
    }
}
