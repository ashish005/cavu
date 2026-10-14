import {Component, TemplateRef} from '@angular/core';

@Component({
    standalone: false,
    templateUrl: './layout.html',
    styles: [`::ng-deep ng-component{ display: contents;}`]
})
export class SubscriptionLayout {
    public actionTemplate: TemplateRef<any> | null = null;
    public pageTitleTemplate: TemplateRef<any> | null = null;

    public readonly navList = [
        {
            isFLatChildren: true, key: 'Subscription',
            children: [
                {routeTo: ['info'], icon: 'fa fa-id-card-o', key: 'License'},
                {routeTo: ['payment'], icon: 'fa fa-credit-card', key: 'Plans & Payment'}
            ]
        },
        {
            isFLatChildren: true, key: 'Billing',
            children: [
                {routeTo: ['license-history'], icon: 'fa fa-history', key: 'License history'},
                {routeTo: ['invoices'], icon: 'fa fa-file-text-o', key: 'Invoices'}
            ]
        }
    ];

    /** Views expose their own title/action templates; views without them clear the header. */
    onActivate(view: any) {
        this.actionTemplate = view?.actionTemplate ?? null;
        this.pageTitleTemplate = view?.pageTitleTemplate ?? null;
    }
}
