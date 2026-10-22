import {Component, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";

/**
 * Layout of Teams (`/app/admin/org-team`) and Notifications (`/app/admin/notification`): a side menu linking both, and
 * a header showing the page's title and buttons. The admin shell (SetupLayout) renders only the app header, so pages
 * need this to show their actions.
 */
@Component({
    selector: 'people-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, GlobalModule],
    styles: [`::ng-deep ng-component { display: contents; }`],
    template: `
        <div class="app">
            <org-aside [data]="navList"></org-aside>
            <div id="content" class="app-content">
                <div class="navbar flex-nowrap white lt box-shadow">
                    <a data-toggle="modal" data-target="#content-aside" data-modal="" class="mr-1 d-md-none">
                        <span class="btn btn-sm btn-icon primary"><i class="fa fa-th"></i></span>
                    </a>
                    <ng-container *ngIf="pageTitleTemplate; else plainTitle"><ng-container *ngTemplateOutlet="pageTitleTemplate"></ng-container></ng-container>
                    <ng-template #plainTitle><div class="no-shadow"><h6 class="mb-0">{{ title }}</h6></div></ng-template>
                    <span class="flex"></span>
                    <ng-container *ngTemplateOutlet="actionTemplate"></ng-container>
                </div>
                <div id="content-main" class="content-main d-flex flex">
                    <router-outlet (activate)="onActivate($event)"></router-outlet>
                </div>
            </div>
        </div>`
})
export class PeopleLayoutComponent {
    actionTemplate: TemplateRef<any> | null = null;
    pageTitleTemplate: TemplateRef<any> | null = null;
    title = '';

    readonly navList = [
        {
            isFLatChildren: true, key: 'People',
            children: [
                {routeTo: ['/app/admin/org-team'], icon: 'fa fa-users', key: 'Teams'}
            ]
        },
        {
            isFLatChildren: true, key: 'Notifications',
            children: [
                {routeTo: ['/app/admin/notification/overview'], icon: 'fa fa-dashboard', key: 'Overview'},
                {routeTo: ['/app/admin/notification/list'], icon: 'fa fa-bell', key: 'What is sent'},
                {routeTo: ['/app/admin/notification/log'], icon: 'fa fa-history', key: 'Delivery log'},
                {routeTo: ['/app/admin/notification/me'], icon: 'fa fa-user', key: 'My notifications'},
                {routeTo: ['/app/admin/process/triggers'], icon: 'fa fa-random', key: 'Workflow rules'}
            ]
        }
    ];

    constructor(private route: ActivatedRoute) {}

    /** Pages expose their own title/action templates; others get the route's title. */
    onActivate(view: any) {
        this.actionTemplate = view?.actionTemplate ?? null;
        this.pageTitleTemplate = view?.pageTitleTemplate ?? null;
        let r = this.route.firstChild;
        while (r?.firstChild) { r = r.firstChild; }
        this.title = r?.snapshot.data['title'] ?? '';
    }
}
