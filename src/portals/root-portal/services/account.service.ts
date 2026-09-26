// import {Injectable, Injector} from "@angular/core";
// import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
// import {ASIDE_CLASS, ASIDE_SIZE, SharedService, CoreEndpointBase, OrgResourceService} from "@app-global";
// import {
//   BankingSetupLookup,
//   PaymentSetupLookup,
//   BankQueryOptions,
//   PaymentQueryOptions,
//   Bank,
//   PaymentProvider,
//   PaymentRail
// } from "../domains/account.serializer";
// import {map} from "rxjs";
//
// @Injectable()
// export class bankingService extends OrgResourceService<any> {
//   constructor(public override injector: Injector) { super(injector); }
//
//
//   // Individual Account Endpoints
//   getAccountNatures() {
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/account-natures`,
//       this.requestHeaders
//     );
//   }
//
//   getSupplyNatures() {
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/supply-natures`,
//       this.requestHeaders
//     );
//   }
//
//   getBanks(countryId?: number) {
//     const params = countryId ? `?countryId=${countryId}` : '';
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/banks${params}`,
//       this.requestHeaders
//     );
//   }
//
//   getBankBranches(bankId?: string) {
//     const params = bankId ? `?bankId=${bankId}` : '';
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/bank-branches${params}`,
//       this.requestHeaders
//     );
//   }
//
//   getBankAccountTypes() {
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/bank-account-types`,
//       this.requestHeaders
//     );
//   }
//
//   getBankIdentifierTypes() {
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/bank-identifier-types`,
//       this.requestHeaders
//     );
//   }
//
//   getPaymentCardTypes() {
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/payment-card-types`,
//       this.requestHeaders
//     );
//   }
//
//   getBankInstrumentTypes() {
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/bank-instrument-types`,
//       this.requestHeaders
//     );
//   }
//
//   // Payment Endpoints
//   getPaymentProviders() {
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/payment-providers`,
//       this.requestHeaders
//     );
//   }
//
//   getPaymentRails(countryId?: number) {
//     const params = countryId ? `?countryId=${countryId}` : '';
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/payment-rails${params}`,
//       this.requestHeaders
//     );
//   }
//
//   getPaymentModes() {
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/payment-modes`,
//       this.requestHeaders
//     );
//   }
//
//   getPaymentSystemTypes() {
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/payment-system-types`,
//       this.requestHeaders
//     );
//   }
//
//   getCountryPaymentRails(countryId?: number) {
//     const params = countryId ? `?countryId=${countryId}` : '';
//     return this.httpClient.get(
//       this.baseSectorAPIUrl + `/country-payment-rails${params}`,
//       this.requestHeaders
//     );
//   }
// }

import {
    Bank,
    BankingSetupLookup,
    BankSerializer,
    PaymentProvider, PaymentProviderSerializer,
    PaymentSetupLookup
} from "../domains/account.serializer";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {Injectable, Injector} from "@angular/core";
import {CoreEndpointBase, OrgResourceService, SharedService} from "@app-global";

@Injectable()
export class BankService extends OrgResourceService<Bank>
{
    constructor(public override injector: Injector) { super(injector, 'v1/bank', new BankSerializer());}
}

@Injectable()
export class PaymentProviderService extends OrgResourceService<PaymentProvider>
{
    constructor(public override injector: Injector) { super(injector, 'v1/payment-providers', new PaymentProviderSerializer());}
}

@Injectable()
export class BankingSetupResolver extends CoreEndpointBase implements Resolve<any> {
  bankingSetup: BankingSetupLookup;
  constructor(public override injector: Injector, public sharedService: SharedService) { super(injector); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.bankingSetup = new BankingSetupLookup(results.data);
        };
        const failure = (err: any) => {};
        const setup = this.httpClient.get(
            this.baseSectorAPIUrl + `/v1/orgLookup/banking-setup`,
            this.requestHeaders
        );
        //const setup = this.read(this.coreService.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}

@Injectable()
export class PaymentSetupResolver extends CoreEndpointBase implements Resolve<any> {
  paymentSetup: PaymentSetupLookup;

    constructor(public override injector: Injector, public sharedService: SharedService) { super(injector); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.paymentSetup = new PaymentSetupLookup(results.data);
        };
        const failure = (err: any) => {};
        const setup = this.httpClient.get(
            this.baseSectorAPIUrl + `/v1/orgLookup/payment-setup`,
            this.requestHeaders
        );
        //const setup = this.read(this.coreService.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}