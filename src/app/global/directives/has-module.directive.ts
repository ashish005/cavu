import {DestroyRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef, inject} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {switchMap} from "rxjs";
import {EntitlementService} from "../services/orgwise/entitlement/entitlement.service";

/**
 * Renders the element only when the organisation's plan includes the module: `*appHasModule="'FIN'"`.
 * Modules the plans do not list are shown, matching the API.
 */
@Directive({ standalone: true, selector: '[appHasModule]' })
export class HasModuleDirective implements OnInit {
    @Input({required: true}) appHasModule!: string;

    private readonly entitlements = inject(EntitlementService);
    private readonly destroyRef = inject(DestroyRef);
    private rendered = false;

    constructor(private templateRef: TemplateRef<unknown>, private viewContainer: ViewContainerRef) { }

    ngOnInit() {
        // Nothing renders before the first load, so gated content never flashes; later refreshes re-evaluate.
        this.entitlements.load()
            .pipe(switchMap(() => this.entitlements.changes$), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.render(this.entitlements.hasModule(this.appHasModule)));
    }

    private render(show: boolean) {
        if (show && !this.rendered) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else if (!show && this.rendered) {
            this.viewContainer.clear();
        }
        this.rendered = show;
    }
}
