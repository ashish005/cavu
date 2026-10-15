import {Component, EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {CommonModule, DOCUMENT} from "@angular/common";

/**
 * Right-aligned, full-height side panel (the app's `modal-right` aside, as opened by SharedService popups) for editors in any
 * module. The body scrolls; put long lists in a `cdk-virtual-scroll-viewport` inside it. Footer content goes
 * in `<div aside-footer>`. Closes on Escape or a backdrop click.
 *
 *   <app-aside title="Edit team" [subtitle]="…" size="lg" (closed)="editing = null">
 *       … body …
 *       <div aside-footer> … buttons … </div>
 *   </app-aside>
 */
@Component({
    selector: 'app-aside',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="modal-backdrop show" (click)="close()"></div>
        <div class="modal fade modal-open-aside modal-right show d-block" role="dialog" aria-modal="true" [attr.aria-label]="title" (click)="close()">
            <div class="modal-dialog white h-100 m-0 ml-auto" [style.width]="width" style="max-width: 100vw" (click)="$event.stopPropagation()">
                <div class="d-flex flex-column h-100 light bg">
                    <div class="navbar white lt box-shadow d-flex flex-nowrap">
                        <div class="flex text-ellipsis">
                            <h3 class="text-md text-ellipsis mb-0">{{ title }}</h3>
                            <div class="text-sm text-muted text-ellipsis" *ngIf="subtitle">{{ subtitle }}</div>
                        </div>
                        <ng-content select="[aside-actions]"></ng-content>
                        <a class="ml-3" role="button" (click)="close()" title="Close (Esc)"><span class="text-lg l-h-1x">&times;</span></a>
                    </div>
                    <div class="flex scrollable hover" style="min-height: 0; overflow-y: auto">
                        <div class="p-3"><ng-content></ng-content></div>
                    </div>
                    <div class="p-2 white lt b-t d-flex align-items-center justify-content-end flex-wrap">
                        <ng-content select="[aside-footer]"></ng-content>
                    </div>
                </div>
            </div>
        </div>`,
    styles: [`:host { position: fixed; inset: 0; z-index: 1050; display: block; } .modal-backdrop { position: fixed; inset: 0; } .modal { position: fixed; inset: 0; overflow: hidden; }`]
})
export class AsidePanelComponent implements OnInit, OnDestroy {
    @Input() title = '';
    @Input() subtitle: string | null = null;
    /** md ≈ 560px, lg ≈ 760px, xl ≈ 980px; always capped at the viewport width. */
    @Input() size: 'md' | 'lg' | 'xl' = 'md';
    @Output() closed = new EventEmitter<void>();

    constructor(@Inject(DOCUMENT) private document: Document) {}

    get width() { return {md: '560px', lg: '760px', xl: '980px'}[this.size]; }

    ngOnInit() { this.document.body.classList.add('modal-open'); }

    ngOnDestroy() { this.document.body.classList.remove('modal-open'); }

    @HostListener('document:keydown.escape')
    close() { this.closed.emit(); }
}
