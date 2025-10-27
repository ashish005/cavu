import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DynamicComponent} from "@app-global";

@Component({
  standalone: false,
    template: `<div><a class="text-xs _500">{{context.voucher?.voucherNo}}</a>
        <div class="item-except text-sm text-muted h-1x">{{context.voucher?.voucherType}} </div>
    </div>`
})
export class ExpenseVoucherNameCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}

@Component({
  standalone: false,
    template: `<div><a class="text-xs _500">{{context.voucher?.amount | number : '1.2-2'}}</a>
        {{ context.payMode }}
        <div class="item-except text-sm text-muted h-1x">{{context?.accountName}}</div>
    </div>`
})
export class ExpenseAmountCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}

@Component({
  standalone: false,
    template: `<div><a class="text-xs _500">{{context.voucher?.voucherDate }}</a>
        <div class="item-except text-sm text-muted h-1x">{{context.voucher?.valueDate }}</div>
    </div>`
})
export class ExpenseVoucherDateCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}

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
export class ExpenseActionCell extends DynamicComponent{
    constructor(){ super(); }

  showPurchasePayment()
    {
        /*const { voucherId, voucherMasterType } = this.context;
        const inputData: any = {
            data: {
                id: voucherId,
                voucherMasterType: voucherMasterType
            }
        };
        this.voucherFactory.showVoucherPopup(inputData, {text: `Payment Invoice`, desc: '' }, ()=>{});*/
    }
}
