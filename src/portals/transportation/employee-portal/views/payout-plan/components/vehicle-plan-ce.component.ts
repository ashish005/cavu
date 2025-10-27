import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder} from "@angular/forms";
import {PayoutPlanLookupService} from "../services/api.resolver";
import {VehiclePayoutPlanForm} from "../forms/vehicle-payout-plan.form";
import {VehiclePayoutPlanService} from "../services/vehicle-payout-plan.service";

@Component({
    templateUrl: `./templates/vehicle-plan-ce.html`,
  standalone: false
})
export class VehiclePayoutPlanCeComponent extends VehiclePayoutPlanForm {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };

    @Input() id: any;
    @Input() set data(val) { this.populateForm(val); };
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    submitted: boolean = false;

    constructor(public override fb: FormBuilder, public apiResolver: PayoutPlanLookupService, public service: VehiclePayoutPlanService) {
        super(fb);
    }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) { return; }

        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit(true);
        };

        const error = (resp)=> {
            this.submitted = false;
        };

        this.submitted = true;
        const data = form.getRawValue();
        if(this.id) {
            this.service.update(this.id, data).subscribe(success, error);
        } else {
            this.service.create(data).subscribe(success, error);
        }
    }
}
