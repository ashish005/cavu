import {Injectable, Injector} from "@angular/core";
import {SharedService} from "@app-global";

@Injectable()
export class ProductExtensionFactory {
    public items : Array<any> = [
        { id:1, icon:"fa fa-dashboard", route: 'dashboard', name: "dashboard", sortOrder: 1 },
        { id:9, icon:"fa fa-folder-open", route: 'variant', name: "variants", sortOrder: 2 },
        // { id:10, icon:"fa fa-folder-open", route: 'transaction', name: "transactions", sortOrder: 1 },
        { id:10, icon:"fa fa-folder-open", route: 'transactions', name: "Transactions", sortOrder: 3 },
        { id:5, icon:"fa fa-tags", route: 'tokens', name: "tokens", sortOrder: 5 }
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
    constructor(public injector: Injector, public sharedService: SharedService) {}

    //triggerGridRefresh(){ this.subject.next(true); }

    showPaymentPopup(inputData, popupHeader){
        //inputData.lookupMasterType = 'expense';
        // const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        // const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        // const modal$ = this.voucherFactory.showVoucherPurchasePaymentPopup(inputData, popupHeader);
        // modal$.then(onSuccess, onFailure);
    }

    showReceiptPopup(inputData, popupHeader){
        //inputData.lookupMasterType = 'expense';
        // const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        // const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        // const modal$ = this.pluginFactory.showVoucherSaleReceiptPopup(inputData, popupHeader);
        // modal$.then(onSuccess, onFailure);
    }

    showVoucherReportPopup(dataItem, header){
        //this.voucherFactory.showVoucherPopup(dataItem, header, ()=>{});
    }
}
