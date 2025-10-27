import {Injectable, Injector, OnDestroy} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, CoreResourceService, SharedService} from "@app-global"
import {VehicleLookup, VehicleLookupSerializer} from "../domains/lookup";
import {VehicleCeComponent} from "../components/vehicle-ce.component";
import {VehicleInspectionComponent} from "../components/vehicle-inspection.component";
import {VehicleScheduleInspectionComponent} from "../components/vehicle-schedule-inspection.component";
import {VehicleInspectionHistoryComponent} from "../components/vehicle-inspection-history.component";

@Injectable()
export class VehicleAPIResolver extends CoreResourceService<VehicleLookup> {
  masterType: VehicleLookup;
  constructor(public override injector: Injector, private sharedService: SharedService) {
     super(injector, `VehicleLookup`, new VehicleLookupSerializer());
  }
    resolve() {
        const promise = new Promise((resolve, reject) => {
            if(this.masterType)
            {
                return resolve(true);
            }
            const success = (results) => {
                this.masterType = results['data'];
                return resolve(true);
            };
            const failure = (err: any) => { return reject(err); };
            const setup = super.read(super.apiVersion);
            return super.performRouteResolver({name: 'Vehicle' }, setup, success, failure);
        });
        return promise;
    }

    createEditVehicle(inputData, popupHeader, cb){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(VehicleCeComponent, popup, inputData);
        modal$.then(success, failure);
    }

    showInspectionDetails(inputData, popupHeader, cb){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(VehicleInspectionComponent, popup, inputData);
        modal$.then(success, failure);
    }

    scheduleInspection(inputData, popupHeader, cb){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(VehicleScheduleInspectionComponent, popup, inputData);
        modal$.then(success, failure);
    }

    showInspectionHistory(inputData, popupHeader, cb){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(VehicleInspectionHistoryComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
