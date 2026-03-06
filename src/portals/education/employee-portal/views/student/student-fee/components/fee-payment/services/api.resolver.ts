import {EventEmitter, Injectable, Injector} from "@angular/core";
import {FeePaymentLookup, FeePaymentLookupSerializer} from "../domain/fee-payment.lookup";
import {Subscription} from "rxjs";
import {OrgResourceService} from "@app-global";

@Injectable()
export class FeePaymentAPIResolver extends OrgResourceService<FeePaymentLookup>{
    masterType: FeePaymentLookup;
    isLoading: boolean;
    subscription: Subscription;
    constructor(public override injector: Injector) { super(injector, 'feeLookup/fee-payment', new FeePaymentLookupSerializer()); }

    resolve(cb) {
        this.isLoading = true;
        const success = (results) => {
            this.masterType = results['data'];
            cb(this.masterType);
            this.isLoading = false;
        };
        const failure = (err: any) => { this.isLoading = false; };
        this.subscription = this.read(this.apiVersion).subscribe(success, failure);
    }
}