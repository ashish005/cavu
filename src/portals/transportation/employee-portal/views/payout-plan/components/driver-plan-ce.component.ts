import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder} from "@angular/forms";
import {DriverPayoutPlanForm} from "../forms/driver-payout-plan.form";
import {PayoutPlanLookupService} from "../services/api.resolver";
import {DriverPayoutPlanService} from "../services/driver-payout-plan.service";

@Component({
    templateUrl: `./templates/driver-plan-ce.html`,
  standalone: false
})
export class DriverPayoutPlanCeComponent extends DriverPayoutPlanForm {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };

    @Input() id: any;
    @Input() set data(val) { this.populateForm(val); };
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    submitted: boolean = false;
    weekDays: Array<any> = [
        { id: 0, name: 'Sunday'},
        { id: 1, name: 'Monday'},
        { id: 2, name: 'Tuesday'},
        { id: 3, name: 'Wednesday'},
        { id: 4, name: 'Thursday'},
        { id: 5, name: 'Friday'},
        { id: 6, name: 'Saturday'}
    ];

    constructor(public override fb: FormBuilder, public apiResolver: PayoutPlanLookupService, public service: DriverPayoutPlanService) {
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
