import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder} from "@angular/forms";

import {VehicleAPIResolver} from "../services/api.resolver";
import {VehicleInspectionScheduleForm} from "../forms/vehicle-inspection-schedule.form";
import {VehicleService} from "../services/vehicle.service";
import {VehicleInspectionScheduleService} from "../services/vehicle-inspection.service";

@Component({
    templateUrl: `./templates/vehicle-schedule-inspection.html`, standalone: false
})
export class VehicleScheduleInspectionComponent extends VehicleInspectionScheduleForm implements OnInit {
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };

    @Input() id: any;
    schedules: Array<any>;
    constructor(public override fb: FormBuilder, public apiResolver: VehicleAPIResolver, private service: VehicleService,
                public scheduleService: VehicleInspectionScheduleService) {super(fb);}

    ngOnInit(){
        const success = (resp) => {
            this.populateForm(resp.data);
        };
        const failure = () => {};
        this.service.getVehicleSchedule(this.id).subscribe(success, failure);
    }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) { return; }

        const success = (resp)=> {
            this.submitted = false;
            this.scheduleService.refresh$.emit(true);
            //this.onOk.emit(true);
        };

        const error = (resp)=> {
            this.submitted = false;
        };

        this.submitted = true;
        this.service.createVehicleSchedule(this.id, form.value).subscribe(success, error);
    }
}
