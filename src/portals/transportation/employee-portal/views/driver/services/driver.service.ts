import {EventEmitter, Injectable, Injector} from '@angular/core';
import {throwError, map, tap, catchError, Observable } from "rxjs";
import  { OrgResourceService } from "@app-global"
import {Driver, DriverSerializer} from "../domains/driver.serializer";
import {DriverPayout, DriverPayoutSerializer} from "../domains/driver-payout.serializer";
import {DriverPayment, DriverPaymentSerializer} from "../domains/driver-payment.serializer";

@Injectable()
export class DriverService extends OrgResourceService<Driver>{
    constructor(public override injector: Injector) { super(injector, 'driver', new DriverSerializer()); }
}

@Injectable()
export class DriverPayoutService extends OrgResourceService<DriverPayout>{
    refresh$: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(public override injector: Injector) { super(injector, 'driverPayout', new DriverPayoutSerializer()); }

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

@Injectable()
export class DriverPaymentService extends OrgResourceService<DriverPayment>{
    constructor(public override injector: Injector) { super(injector, 'driverPayment', new DriverPaymentSerializer()); }
}
