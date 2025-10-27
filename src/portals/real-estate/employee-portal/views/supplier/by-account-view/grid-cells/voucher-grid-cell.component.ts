import {Component} from "@angular/core";
import {ACTION_ENUM, DynamicComponent} from "@app-global";
import {VendorLookupResolver} from "../services/api.resolver";

@Component({
  //template: `<v-purchase-payment [data]="context" (cb)="showPurchasePayment($event)"></v-purchase-payment>`,
  template: ``,
  standalone: false
})
export class VoucherPurchasePaymentActionCell extends DynamicComponent
{
    constructor(public resolver: VendorLookupResolver){ super(); }

    showPurchasePayment(e)
    {
        const inputData: any = {
            //id: id,
            data: this.context,
            actionType: ACTION_ENUM.SHOW
        };
        this.resolver.showPaymentPopup(inputData, {text: `Payment Invoice`, desc: '' });
    }
}

@Component({
  // template: `<v-sale-receipt [data]="context" (cb)="showSaleReceipt($event)"></v-sale-receipt>`,
  template: ``,
  standalone: false
})
export class VoucherSaleReceiptActionCell extends DynamicComponent
{
    constructor(public resolver: VendorLookupResolver){ super(); }

    showSaleReceipt(e)
    {
        const inputData: any = {
            //id: id,
            data: this.context,
            actionType: ACTION_ENUM.SHOW
        };
        this.resolver.showReceiptPopup(inputData, {text: `Receipt Invoice`, desc: '' });
    }
}
