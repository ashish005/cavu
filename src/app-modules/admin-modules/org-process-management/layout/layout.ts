import {Component, TemplateRef} from '@angular/core';

@Component({
    standalone: false,
    templateUrl: './layout.html',
    styles: [`::ng-deep ng-component{ display: contents;}`]
})
export class ProcessLayout {
    public actionTemplate: TemplateRef<any> | null = null;
    public pageTitleTemplate: TemplateRef<any> | null = null;

    public readonly navList = [
        {
            isFLatChildren: true, key: 'Work',
            children: [
                {routeTo: ['tasks'], icon: 'fa fa-check-square-o', key: 'My tasks'},
                {routeTo: ['processes'], icon: 'fa fa-random', key: 'Processes'},
                {routeTo: ['calendar'], icon: 'fa fa-calendar', key: 'Calendar'}
            ]
        },
        {
            isFLatChildren: true, key: 'Setup',
            children: [
                {routeTo: ['workflows'], icon: 'fa fa-sitemap', key: 'Workflows'},
                {routeTo: ['schedules'], icon: 'fa fa-clock-o', key: 'Schedules'},
                {routeTo: ['triggers'], icon: 'fa fa-bolt', key: 'Triggers'},
                {routeTo: ['events'], icon: 'fa fa-list-alt', key: 'Event log'}
            ]
        }
    ];

    /** Views expose their own title/action templates; views without them clear the header. */
    onActivate(view: any) {
        this.actionTemplate = view?.actionTemplate ?? null;
        this.pageTitleTemplate = view?.pageTitleTemplate ?? null;
    }
}
