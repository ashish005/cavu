import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {
    LookupVoucherType, OrgInvoiceLookup,
    OrgInvoiceLookupSerializer
} from "../domains/lookup.serializer";
import  { OrgResourceService } from "@app-global";

@Injectable()
export class OrgInvoiceAPIResolver extends OrgResourceService<OrgInvoiceLookup> implements Resolve<any> {
  masterType: OrgInvoiceLookup;
  vType: LookupVoucherType;
  constructor(public override injector: Injector) { super(injector, 'accounting/lookup', new OrgInvoiceLookupSerializer());}

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => { this.masterType = results.data; };
    const failure = (err: any) => {};
    const setup = super.read(super.apiVersion);
    return super.performRouteResolver(route.data, setup, success, failure);
  }

  getVoucherTypeById(voucherTypeId) {
      return this.masterType.getVoucherTypeById(voucherTypeId);
  }

    voucherReportPopup = (inputData, header, cb) => {
        /*const onSuccess = (resp)=> { cb(); this.pluginFactory.destroy();};
        const failure = (resp)=> {this.pluginFactory.destroy();};
        this.pluginFactory.showVoucherReportPopup(inputData, header).then(onSuccess, failure);*/
    }
}
