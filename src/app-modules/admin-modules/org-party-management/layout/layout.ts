import {Component, TemplateRef} from '@angular/core';

@Component({
    standalone: false,
    template: `
        <div class="app">
            <org-aside [data]="navList"></org-aside>
            <div id="content" class="app-content">
                <div class="navbar flex-nowrap white lt box-shadow">
                    <ng-container *ngTemplateOutlet="pageTitleTemplate"></ng-container>
                    <span class="flex"></span>
                    <ng-container *ngTemplateOutlet="actionTemplate"></ng-container>
                </div>
                <div class="pl-3 pr-3 py-2"><app-breadcrumb></app-breadcrumb></div>
                <div id="content-main" class="content-main d-flex flex">
                    <router-outlet (activate)="onActivate($event)"></router-outlet>
                </div>
            </div>
        </div>`,
    styles: [`::ng-deep ng-component{ display: contents;}`]
})
export class PartyLayout {
    public actionTemplate: TemplateRef<any> | null = null;
    public pageTitleTemplate: TemplateRef<any> | null = null;

    public readonly navList = [
        {
            isFLatChildren: true, key: 'Parties',
            children: [
                {routeTo: ['customers'], icon: 'fa fa-users', key: 'Customers'},
                {routeTo: ['vendors'], icon: 'fa fa-truck', key: 'Vendors'},
                {routeTo: ['employees'], icon: 'fa fa-id-badge', key: 'Employees'}
            ]
        },
        {
            isFLatChildren: true, key: 'Reports',
            children: [
                {routeTo: ['aging'], icon: 'fa fa-hourglass-half', key: 'Aging'},
                {routeTo: ['1099'], icon: 'fa fa-file-text-o', key: '1099 summary'}
            ]
        },
        {
            isFLatChildren: true, key: 'Setup',
            children: [{routeTo: ['settings'], icon: 'fa fa-sliders', key: 'Settings'}]
        }
    ];

    onActivate(view: any) {
        this.actionTemplate = view?.actionTemplate ?? null;
        this.pageTitleTemplate = view?.pageTitleTemplate ?? null;
    }
}
