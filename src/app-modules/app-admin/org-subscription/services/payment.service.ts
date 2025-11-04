import {Injectable, Injector} from "@angular/core";
import {CoreEndpointBase} from "@app-global";
import {catchError, map} from "rxjs/operators";

@Injectable()
export class PaymentService extends CoreEndpointBase {
  constructor(public override injector: Injector) { super(injector); }

    getLicenseInfoEndpoint(){
        const { businessMasterType, sectorMasterType, softwareId} = this.orgSetup;
        return this.httpClient
            .get(this.baseAPIUrl+`/subscription`, this.requestHeaders)
            .pipe(
                catchError(error => { return this.handleError(error, () => this.getLicenseInfoEndpoint()); })
            );
    }

    public getPaymentLookup(){
        const { businessMasterType, sectorMasterType, softwareId} = this.orgSetup;
        return this.httpClient
            .get(`${this.baseAPIUrl}/subscription/payment/${softwareId}`, this.requestHeaders)
            .pipe(
                map((resp: any) => resp.data),
                catchError(error => this.handleError(error, () => this.getPaymentLookup()))
            );
    }

    savePaymentDetails(data: any) {
        return this.httpClient
            .post(`${this.baseAPIUrl}/subscription/payment`, data, this.requestHeaders)
            .pipe(
                map((resp: any) => resp),
                catchError(error => this.handleError(error, () => this.savePaymentDetails(data)))
            );
    }
}
