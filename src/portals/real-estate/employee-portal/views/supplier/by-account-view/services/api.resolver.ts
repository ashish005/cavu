import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {OrgResourceService} from "@app-global";
import {
    VendorByIdLookup,
    VendorByIdLookupSerializer,
    VendorLookup,
    VendorLookupSerializer
} from "../domains/vendor.lookup";

@Injectable()
export class VendorLookupResolver extends OrgResourceService<VendorLookup> implements Resolve<any> {
    masterType: VendorLookup;
    public items : Array<any> = [
        { id:2, icon:"fa fa-dashboard", route: 'details', name: "sideOptions.dashboard", sortOrder: 1 },
        { id:9, icon:"fa fa-folder-open", route: 'services', name: "sideOptions.services", sortOrder: 2 },
        { id:10, icon:"fa fa-user", route: 'executive', name: "sideOptions.executives", sortOrder: 3 },
        { id:6, icon:"fa fa-calculator", route: 'invoice', name: "sideOptions.invoices", sortOrder: 4 },
        { id:11, icon:"fa fa-folder-open", route: 'purchase-order', name: "Purchase Order", sortOrder: 5 },
    ];
    public reportItems: any = {
        name: "Reports",
        children:[
            { id:11, icon:"fa fa-graduation-cap", name: "reports.acc_statement", sortOrder: 1 },
            { id:12, icon:"fa fa-graduation-cap", name: "reports.invoice_details", sortOrder: 1 },
            { id:13, icon:"fa fa-location-arrow", name: "reports.project_revenue", sortOrder: 1 },
            { id:14, icon:"fa fa-folder-open", name: "reports.payment_collected", sortOrder: 1 },
            { id:15, icon:"fa fa-folder-open", name: "reports.time_entry", sortOrder: 1 }
        ]
    };

    constructor(public override injector: Injector) {
        super(injector, 'supplierLookup', new VendorLookupSerializer());
    }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.masterType = results.data;
        };
        const failure = (err: any) => {};
        const setup = this.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }

    //triggerGridRefresh(){ this.subject.next(true); }
    showPaymentPopup(inputData, popupHeader){
        //inputData.lookupMasterType = 'expense';
        /*const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        const modal$ = this.pluginFactory.showVoucherPurchasePaymentPopup(inputData, popupHeader);
        modal$.then(onSuccess, onFailure);*/
    }

    showReceiptPopup(inputData, popupHeader){
        //inputData.lookupMasterType = 'expense';
        /*const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        const modal$ = this.pluginFactory.showVoucherSaleReceiptPopup(inputData, popupHeader);
        modal$.then(onSuccess, onFailure);*/
    }

    showVoucherReportPopup(dataItem, header){
        //inputData.lookupMasterType = 'expense';
        /*const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        const modal$ = this.pluginFactory.showVoucherReportPopup(dataItem, header);
        modal$.then(onSuccess, onFailure);*/
    }
}

@Injectable()
export class VendorByIdAPIResolver extends OrgResourceService<VendorByIdLookup> implements Resolve<any> {
    vendor: VendorByIdLookup;
    constructor(public override injector: Injector) { super(injector, 'supplierLookup/by-account', new VendorByIdLookupSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.vendor = new VendorByIdLookup(results.data);
        };

        const { accountId } = route.params;
        const failure = (err: any) => {};
        const endpoint = `${accountId}/${this.apiVersion}`;
        const setup = this.read(endpoint);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}


