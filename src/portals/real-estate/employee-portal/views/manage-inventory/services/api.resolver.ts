import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {ProductById, ProductByIdSerializer, ProductLookup, ProductLookupSerializer} from "../domains/product.lookup";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService } from "@app-global";
import {MasterTypeLayout} from "../components/master-type.component";

@Injectable()
export class ProductLookupResolver extends OrgResourceService<ProductLookup> implements Resolve<any> {
    masterType: ProductLookup;
    public items : Array<any> = [
        { id:1, icon:"fa fa-dashboard", route: 'dashboard', name: "dashboard", sortOrder: 1 },
        { id:9, icon:"fa fa-folder-open", route: 'variant', name: "variants", sortOrder: 1 },
        // { id:10, icon:"fa fa-folder-open", route: 'transaction', name: "transactions", sortOrder: 1 },
        { id:10, icon:"fa fa-folder-open", route: 'purchase-order', name: "Purchase History", sortOrder: 1 },
        { id:10, icon:"fa fa-folder-open", route: 'sale-order', name: "Sale History", sortOrder: 1 },

        //{ id:3, icon:"fa fa-pie-chart", route: 'categories', name: "categories", sortOrder: 1 },
        //{ id:5, icon:"fa fa-money", route: 'attributes', name: "Attributes", sortOrder: 1 },
        //{ id:5, icon:"fa fa-tags", route: 'tokens', name: "tokens", sortOrder: 1 }
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
        super(injector, 'productLookup', new ProductLookupSerializer());
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

    showMasterTypePopup(inputData, popupHeader){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(MasterTypeLayout, popup, inputData);
        modal$.then(success, failure);
    }
}

@Injectable()
export class ProductAPIResolver extends OrgResourceService<ProductById> implements Resolve<any> {
    product: ProductById;

    constructor(public override injector: Injector) { super(injector, 'product', new ProductByIdSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.product = results.data;
        };

        const { productId } = route.params;
        const failure = (err: any) => {};
        const endpoint = `${productId}`;
        const setup = this.read(endpoint);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}
