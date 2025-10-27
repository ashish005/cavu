import {Component, OnInit} from "@angular/core";
import {AlertService, ASIDE_CLASS, ASIDE_SIZE, DynamicComponent, SharedService} from "@app-global";
import {VehicleAPIResolver} from "../services/api.resolver";
import {VehicleInspectionService} from "../services/vehicle-inspection.service";

@Component({
    template:  `{{ context.inspectionStatus }}
    <a class="text-primary text-xs" (click)="showDetails()"> Details </a>`,
  standalone: false
})
export class VehicleInspectionStatusCellComponent extends DynamicComponent {
    constructor(public apiResolver: VehicleAPIResolver,
                private service: VehicleInspectionService){
        super();
    }

    showDetails() {
        const inputData: any = {
            id: this.context.id,
            data: this.context
        };
        this.apiResolver.showInspectionDetails(inputData, {text: `${this.context.vehicleNo}`, desc: '' }, ()=>{
            this.service.refresh$.emit(true);
        });
    }
}
