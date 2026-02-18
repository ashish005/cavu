import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {
    PaymentGatewayLookup,
    PaymentGatewayLookupSerializer, PaymentSystemTypeLookup
} from "../domains/lookup.serializer";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService} from "@app-global";
import {PaymentGatewayCeComponent} from "../components/payment-gateway-ce.component";
import {ServiceChargeCeComponent} from "../components/service-charge.ce.component";
import {PaymentGatewayService} from "./payment-gateway.service";
import {BankInstrumentInfoComponent} from "../components/bank-instrument-info.component";

@Injectable()
export class PaymentGatewayLookupAPIResolver extends OrgResourceService<PaymentGatewayLookup> implements Resolve<any> {
  masterType: PaymentGatewayLookup;
  allSystemType = new PaymentSystemTypeLookup({name: 'All', masterType: 'all'});
  constructor(public override injector: Injector, private sharedService: SharedService, public service: PaymentGatewayService) {
      super(injector, 'paymentGatewayLookup', new PaymentGatewayLookupSerializer());
  }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results.data;
    };
    const failure = (err: any) => {};
    const setup = super.read(super.apiVersion);
    return super.performRouteResolver(route.data, setup, success, failure);
  }

    showSchedulerPopup(gatewayId, inputData, popupHeaderOption, cb){
        /*const schedulerSuccess = (resp: any) => {
            this.schedulerFactory.destroy();
            cb(resp?.data?.orgTaskScheduleId);
        };

        const failure = (err)=> { this.schedulerFactory.destroy(); };
        const success = (resp: any)=> {
            if(inputData.addManually && !resp.id){
                this.service.createPaymentGatewayScheduler(resp, gatewayId).toPromise().then(schedulerSuccess, failure);
            } else {
                schedulerSuccess(resp);
            }
        };
        this.schedulerFactory.showSchedulerPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showPaymentGatewayCEPopup(inputData: any, popupHeaderOptions: any, cb){
        const popup = {
            header: popupHeaderOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = ()=>{ this.sharedService.destroy(); };
        this.sharedService.showCustomPopup(PaymentGatewayCeComponent, popup, inputData).then(success, failure);
    }

    showBankInstruments(inputData: any, popupHeaderOptions: any, cb){
        const popup = {
            header: popupHeaderOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = ()=>{ this.sharedService.destroy(); };
        this.sharedService.showCustomPopup(BankInstrumentInfoComponent, popup, inputData).then(success, failure);
    }

    showServiceChargeCE(inputData: any, popupHeaderOptions: any) {
        const popup = {
            header: popupHeaderOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };

        const success = (resp: any) => { this.sharedService.destroy(); };
        const error = (resp: any) => { this.sharedService.destroy(); };

        this.sharedService.showCustomPopup(ServiceChargeCeComponent, popup, inputData).then(success, error);
    }
}
