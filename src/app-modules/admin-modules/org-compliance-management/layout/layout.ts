import {Component, TemplateRef} from '@angular/core';

/** Compliance shell: left navigation, the routed view's title and actions, and the view. */
@Component({
    standalone: false,
    templateUrl: './layout.html',
    styles: [`::ng-deep ng-component{ display: contents;}`]
})
export class ComplianceLayout {
    public actionTemplate: TemplateRef<any> | null = null;
    public pageTitleTemplate: TemplateRef<any> | null = null;

    public readonly navList = [
        {
            isFLatChildren: true, key: 'Work',
            children: [
                {routeTo: ['dashboard'], icon: 'fa fa-line-chart', key: 'Dashboard'},
                {routeTo: ['tasks'], icon: 'fa fa-check-square-o', key: 'Tasks'},
                {routeTo: ['calendar'], icon: 'fa fa-calendar', key: 'Calendar'},
                {routeTo: ['registrations'], icon: 'fa fa-id-card-o', key: 'Licences & registrations'},
                {routeTo: ['report'], icon: 'fa fa-bar-chart', key: 'Report'}
            ]
        },
        {
            isFLatChildren: true, key: 'Setup',
            children: [
                {routeTo: ['obligations'], icon: 'fa fa-list-ul', key: 'Obligations'},
                {routeTo: ['setup'], icon: 'fa fa-sliders', key: 'Profile & catalog'}
            ]
        }
    ];

    /** Views expose their own title/action templates; views without them clear the header. */
    onActivate(view: any) {
        this.actionTemplate = view?.actionTemplate ?? null;
        this.pageTitleTemplate = view?.pageTitleTemplate ?? null;
    }
}
