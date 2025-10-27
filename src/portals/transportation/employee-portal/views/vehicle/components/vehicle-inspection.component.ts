import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder} from "@angular/forms";
import {VehicleAPIResolver} from "../services/api.resolver";
import {VehicleInspectionForm} from "../forms/vehicle-inspection.form";
import {VehicleInspection} from "../domains/vehicle-inspection.serializer";
import {VehicleInspectionService} from "../services/vehicle-inspection.service";

@Component({
    templateUrl: `./templates/vehicle-inspection.html`, standalone: false
})
export class VehicleInspectionComponent extends VehicleInspectionForm implements OnInit {
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };

    @Input() id: any;
    @Input() set data (item: VehicleInspection) { super.populateForm(item); }

    constructor(public override fb: FormBuilder, public apiResolver: VehicleAPIResolver, private service: VehicleInspectionService) {
        super(fb);
    }

    ngOnInit(){}

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) { return; }

        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit({ refresh: true });
        };

        const error = (resp)=> {
            this.submitted = false;
        };

        this.submitted = true;
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, form.value).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(form.value).subscribe(success, error);
        }
    }
}
