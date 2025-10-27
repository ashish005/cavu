import {EventEmitter, Injectable, Injector} from '@angular/core';
import {throwError, map, tap, catchError, Observable} from "rxjs";
import  { OrgResourceService, CoreResourceService } from "@app-global"
import {Vehicle, VehicleSerializer} from "../domains/vehicle.serializer";
import {VehiclePayout, VehiclePayoutSerializer} from "../domains/vehicle-payout.serializer";

@Injectable()
export class VehicleService extends OrgResourceService<Vehicle>{
    constructor(public override injector: Injector) { super(injector, 'vehicle', new VehicleSerializer()); }

    public getVehicleSchedule(vehicleId){
        return this.httpClient.get(`${this.viewUrl}/${vehicleId}/schedule-inspection`, this.requestHeaders)
            .pipe(
                catchError(error => {
                    return this.handleError(error, () => this.getVehicleSchedule(vehicleId));
                }));
    }

    createVehicleSchedule(vehicleId, data){
        return this.httpClient.post(`${this.viewUrl}/${vehicleId}/schedule-inspection`, data, this.requestHeaders)
            .pipe(
                catchError(error => {
                    return this.handleError(error, () => this.createVehicleSchedule(vehicleId, data));
                }));
    }
}

@Injectable()
export class VehiclePayoutService extends CoreResourceService<VehiclePayout>{
    refresh$: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(public override injector: Injector) { super(injector, 'vehiclePayout', new VehiclePayoutSerializer()); }

    public generatePayslip(payslipId): Observable<any>{
        return this.httpClient
            .patch(`${this.viewUrl}/${payslipId}/generate-payslip`, { payslipId: payslipId }, this.requestHeaders)
            .pipe(
                tap((resp: any) => console.log('read logged')),
                catchError((error)=>{ return throwError(error); })
            );
    }

    public makePayment(payslipId): Observable<any>{
        return this.httpClient
            .post(`${this.viewUrl}/${payslipId}/payment`, { payslipId: payslipId }, this.requestHeaders)
            .pipe(
                tap((resp: any) => console.log('read logged')),
                catchError((error)=>{ return throwError(error); })
            );
    }
}
