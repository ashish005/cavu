import {Component, Input, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";

@Component({
    selector: 'pricing-plan',
    templateUrl: `./templates/pricing-plan.html`
})
export class PricingPlanComponent {
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor() {}

    onSubmit(form) {
        // stop here if form is invalid
    }
}
