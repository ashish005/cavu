import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM, DateFormatCell, ViewExtender} from "@app-global";

import {VehicleAPIResolver} from "../services/api.resolver";
import {ActivatedRoute, Router} from "@angular/router";
import {VehicleInspectionScheduleService} from "../services/vehicle-inspection.service";
import {
    VehicleInspectionSchedule,
    VehicleInspectionScheduleQueryOptions
} from "../domains/vehicle-inspection-schedule.serializer";

@Component({
    selector: `schedule-history`,
    templateUrl: `./templates/vehicle-schedule-history.html`, standalone: false
})
export class VehicleScheduleHistoryComponent extends ViewExtender<VehicleInspectionSchedule> implements OnInit {
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    @Input() vehicleId: any;
    override coreState: VehicleInspectionScheduleQueryOptions = new VehicleInspectionScheduleQueryOptions();
    constructor(public router: Router,
                public apiResolver: VehicleAPIResolver, public override activatedRoute: ActivatedRoute, public override service: VehicleInspectionScheduleService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: false, delete: false };
    }

    ngOnInit(){
        //const today = new Date().toISOString().split('T')[0];
        this.coreState.vehicleId = this.vehicleId;
        this.populateGrid();

        this.service.refresh$.subscribe(r =>{
            this.populateGrid();
        })
    }
}
