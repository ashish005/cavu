import {Component, NgModule, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {PartyViewsModule} from "./party-views.module";
import {PartyListView} from "./views/party-list.view";
import {PartyDetailView} from "./views/party-detail.view";

/**
 * Hosts a party list / detail inside a sector portal, whose layout has its own sidebar but no page header: this shell
 * shows the view's title and actions (New, Edit, Back…) above it.
 */
@Component({
    selector: 'party-portal-shell',
    standalone: false,
    template: `
        <div class="d-flex flex-column flex" style="min-width: 0">
            <div class="navbar flex-nowrap white lt box-shadow px-3" *ngIf="titleTemplate || actionTemplate">
                <ng-container *ngTemplateOutlet="titleTemplate"></ng-container>
                <span class="flex"></span>
                <ng-container *ngTemplateOutlet="actionTemplate"></ng-container>
            </div>
            <div class="d-flex flex" style="min-height: 0">
                <router-outlet (activate)="onActivate($event)"></router-outlet>
            </div>
        </div>`,
    styles: [`:host { display: flex; flex: 1 1 auto; min-width: 0; } ::ng-deep ng-component { display: contents; }`]
})
export class PartyPortalShell {
    titleTemplate: TemplateRef<any> | null = null;
    actionTemplate: TemplateRef<any> | null = null;

    onActivate(view: any) {
        this.titleTemplate = view?.pageTitleTemplate ?? null;
        this.actionTemplate = view?.actionTemplate ?? null;
    }
}

/** Mounted by portal routes with data { role, module, embedded: true } (see core-modules/index.ts). */
const routes: Routes = [
    {
        path: '', component: PartyPortalShell,
        children: [
            {path: '', component: PartyListView},
            {path: ':id', component: PartyDetailView}
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), PartyViewsModule],
    declarations: [PartyPortalShell]
})
export class PartyPortalModule {}
