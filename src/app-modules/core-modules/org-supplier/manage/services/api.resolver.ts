import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {
    VendorLookup,
    VendorLookupSerializer
} from "../domains/vendor.lookup";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService} from "@app-global";
import {VendorBranchCEComponent} from "../components/vendor-branch-ce.component";
import {VendorCEComponent} from "../components/vendor-ce.component";
import {VendorBrandCEComponent} from "../components/vendor-brand-ce.component";

@Injectable()
export class VendorLookupResolver extends OrgResourceService<VendorLookup> implements Resolve<any> {
    masterType: VendorLookup;
    public items : Array<any> = [
        { id:2, icon:"fa fa-dashboard", route: 'details', name: "dashboard", sortOrder: 1 },
        { id:9, icon:"fa fa-folder-open", route: 'services', name: "services", sortOrder: 2 },
        { id:10, icon:"fa fa-user", route: 'executive', name: "executives", sortOrder: 3 },
        { id:6, icon:"fa fa-calculator", route: 'invoice', name: "invoices", sortOrder: 4 },
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

    constructor(public override injector: Injector, public sharedService: SharedService) {
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
    // showPaymentPopup(inputData, popupHeader){
    //     //inputData.lookupMasterType = 'expense';
    //     const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
    //     const onFailure = (resp)=> { this.pluginFactory.destroy(); };
    //     const modal$ = this.pluginFactory.showVoucherPurchasePaymentPopup(inputData, popupHeader);
    //     modal$.then(onSuccess, onFailure);
    // }
    //
    // showReceiptPopup(inputData, popupHeader){
    //     //inputData.lookupMasterType = 'expense';
    //     const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
    //     const onFailure = (resp)=> { this.pluginFactory.destroy(); };
    //     const modal$ = this.pluginFactory.showVoucherSaleReceiptPopup(inputData, popupHeader);
    //     modal$.then(onSuccess, onFailure);
    // }
    //
    // showVoucherReportPopup(dataItem, header){
    //     //inputData.lookupMasterType = 'expense';
    //     const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
    //     const onFailure = (resp)=> { this.pluginFactory.destroy(); };
    //     const modal$ = this.pluginFactory.showVoucherReportPopup(dataItem, header);
    //     modal$.then(onSuccess, onFailure);
    // }

    showVendorBranchPopup(inputData, popupHeader, cb){
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

        let modal$ = this.sharedService.showCustomPopup(VendorBranchCEComponent, popup, inputData);
        modal$.then(success, failure);
    }

    showVendorPopup(inputData, popupHeader, cb){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb(resp);
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(VendorCEComponent, popup, inputData);
        modal$.then(success, failure);
    }

    showVendorBrandPopup(inputData, popupHeader, cb){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_25
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb(resp);
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(VendorBrandCEComponent, popup, inputData);
        modal$.then(success, failure);
    }
}


