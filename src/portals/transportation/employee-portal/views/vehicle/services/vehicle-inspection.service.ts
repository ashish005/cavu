import {EventEmitter, Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global"
import {VehicleInspection, VehicleInspectionSerializer} from "../domains/vehicle-inspection.serializer";
import {
    VehicleInspectionSchedule,
    VehicleInspectionScheduleSerializer
} from "../domains/vehicle-inspection-schedule.serializer";


@Injectable()
export class VehicleInspectionService extends OrgResourceService<VehicleInspection>{
    refresh$: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(public override injector: Injector) { super(injector, 'VehicleInspection', new VehicleInspectionSerializer()); }
}

@Injectable()
export class VehicleInspectionScheduleService extends OrgResourceService<VehicleInspectionSchedule>{
    refresh$: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(public override injector: Injector) { super(injector, 'VehicleInspectionSchedule', new VehicleInspectionScheduleSerializer()); }
}
