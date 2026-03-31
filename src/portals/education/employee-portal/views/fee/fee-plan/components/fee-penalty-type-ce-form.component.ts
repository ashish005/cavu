import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder} from "@angular/forms";
import {FeePlanLookupService} from "../services/api.resolver";
import {FeePenaltyTypeForm} from "../forms/fee-penalty-type.form";
import {FeePenaltyType} from "../domains/fee-penalty-type.serializer";
import {ACTION_ENUM, CalculationTypes, PENALTY_FREQUENCY_TYPE, PenaltyFrequencies} from "@app-global";
import {FeePenaltyTypeService} from "../services/fee-penalty-type.service";

@Component({
    standalone: false,
    selector: 'fee-penalty-type-ce-form',
    templateUrl: './templates/fee-penalty-type-ce-form.html',
    styles: [`:host{ display: contents; }`]
})
export class FeePenaltyTypeCeFormComponent extends FeePenaltyTypeForm
{
    calculationTypes = CalculationTypes;
    penaltyFrequencies = PenaltyFrequencies;
    frequency: any = PENALTY_FREQUENCY_TYPE;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    submitted: boolean = false;

    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() set data(item: FeePenaltyType) { this.populateData(item); };
    @Input() id;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public override fb: FormBuilder, private service: FeePenaltyTypeService, public lookupService: FeePlanLookupService) {
        super(fb);
    }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        this.submitted = true;
        if(this.id) {
            this.service.update(this.id, form.value).subscribe((resp: any) => {
                this.submitted = false;
                this.onOk.emit(true);
            });
        } else {
            this.service.create(form.value).subscribe((resp: any) => {
                this.submitted = false;
                this.onOk.emit(true);
            });
        }
    }
}