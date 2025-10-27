import {Component} from "@angular/core";
import {ACTION_ENUM, DynamicComponent} from "@app-global";
import {ProductExtensionFactory} from "../services/extension.factory";

@Component({
  standalone: false,
  template: `<div *ngIf="context?.voucherMasterType == 'purchase'">
    <a class="text-xs _500 text-primary" *ngIf="!context?.status" (click)="showPurchasePayment()">
      Pay {{ context?.remainingPayment | number: '1.2-2' }}
    </a>
    <a class="text-xs _500 text-success" *ngIf="context?.status == 'settled'"> Paid </a>
    <a class="text-xs _500 text-danger" *ngIf="context?.status == 'manage'"> Extra Paid </a>
  </div>`
})
export class VoucherPurchasePaymentActionCell extends DynamicComponent
{
    constructor(public factory: ProductExtensionFactory){ super(); }

    showPurchasePayment()
    {
        const inputData: any = {
            //id: id,
            data: this.context,
            actionType: ACTION_ENUM.SHOW
        };
        this.factory.showPaymentPopup(inputData, {text: `Payment Invoice`, desc: '' });
    }
}

@Component({
  standalone: false,
  template: `<div *ngIf="context?.voucherMasterType == 'sale'">
    <a class="text-xs _500 text-primary" *ngIf="!context?.status" (click)="showSaleReceipt()">
      Pending Receipt {{ context?.remainingPayment | number: '1.2-2' }}
    </a>
    <a class="text-xs _500 text-success" *ngIf="context?.status == 'settled'">Settled</a>
    <a class="text-xs _500 text-danger" *ngIf="context?.status == 'manage'">Extra Received</a>
  </div>`
})
export class VoucherSaleReceiptActionCell extends DynamicComponent
{
    constructor(public factory: ProductExtensionFactory){ super(); }

    showSaleReceipt()
    {
        const inputData: any = {
            //id: id,
            data: this.context,
            actionType: ACTION_ENUM.SHOW
        };
        this.factory.showReceiptPopup(inputData, {text: `Receipt Invoice`, desc: '' });
    }
}
