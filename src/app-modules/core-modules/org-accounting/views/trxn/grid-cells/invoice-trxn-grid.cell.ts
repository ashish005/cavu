import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DynamicComponent, SharedService} from "@app-global";
import {InvoiceTrxn} from "../domains/invoice-trxn";

@Component({
  standalone: false,
    template: `<div>
        <a class="text-sm _500"> {{ context.voucherNo }}</a>
        <a><span class="text-xs px-2 text-muted">/ {{ context.voucherDate | dateFormat }}</span></a>
        <ul class="nav nav-xs no-border">
            <li class="nav-item"><a class="nav-link text-muted no-border" title="Send Notification" (click)="sendNotification(context)" data-original-title="Send Notification"><span class="nav-text py-0"><i class="fa fa-envelope"></i></span></a></li>
            <li class="nav-item b-l p-l"><a class="nav-link text-muted" title="Report" data-pjax-state="" data-original-title="Report" (click)="showPDF(context)"><span class="nav-text py-0"><i class="fa fa-file-pdf-o"></i></span></a></li>
            <li class="nav-item"><a class="nav-link text-muted" title="Activity" data-pjax-state="" (click)="showActivity(context)"><span class="nav-text py-0"><i class="fa fa-history"></i></span></a></li>
            <li class="nav-item" [class.hide]="!context.schedule"><a class="nav-link" [ngbPopover]="content" placement="left" popoverTitle="Schedules" container="body" triggers="auto" [autoClose]="true" #p="ngbPopover" (click)="p.toggle()"><span class="nav-text py-0"><i class="fa fa-fw fa-clock-o"></i></span></a></li>
        </ul>
        <ng-template #content>
            <div class="m-0 w w-xl">
                <p class="m-0"><a class="text-primary">{{context.schedule?.scheduleType}}</a></p>
                <ng-template ngFor let-dte [ngForOf]="context.schedule.scheduleDates">
                    <small class="d-block text-muted"><i class="fa fa-fw fa-clock-o"></i> {{dte | dateFormat}}</small>
                </ng-template>
            </div>
        </ng-template>
    </div>`
})
export class InvoiceNoDateGridCell extends DynamicComponent {
    constructor(private router: Router, public activatedRoute: ActivatedRoute) { super(); }

    showActivity(row: InvoiceTrxn) {
        //this.apiResolver.showNotificationHistoryPopup(row);
    }

    sendNotification(row: InvoiceTrxn) {
        //this.apiResolver.sendInvoiceNotification(row);
    }

    showPDF(row: InvoiceTrxn) {
        //this.apiResolver.showInvoicePrintPopup(row);
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500">{{context.foreignBalance | voucherCurrency : context.currencyCode}} or {{ context.invoiceStatus?.amount | orgCurrency }} </a>
        <ul class="nav nav-xs no-border">
            <li class="nav-item">
                <a class="nav-link text-muted" [ngbPopover]="content" placement="left" popoverTitle="Bill To Bill" container="body" triggers="auto" [autoClose]="true" #p="ngbPopover" (click)="p.toggle()"><span class="nav-text py-0"><i class="fa fa-fw fa-list"></i></span></a>
            </li>
            <li class="nav-item b-l p-l">
                <div class="text-xs _500" [ngSwitch]="context.invoiceStatus?.status">
                    <a *ngSwitchCase="'settled'" class="px-2"><span class="text-muted">Settled</span></a>
                    <a *ngSwitchCase="'extra'" class="px-2">
                        <span class="text-danger" *ngIf="context.voucherMasterType=='purchase'">Extra Paid</span>
                        <span class="text-danger" *ngIf="context.voucherMasterType=='sale'">Extra Received</span>
                        {{context.foreignBalance | voucherCurrency : context.currencyCode}}
                    </a>
                    <a *ngSwitchCase="'manage'" class="btn btn-xs text-xs" (click)="createPaymentOrReceipt(context)">
                        <span class="text-success _500" *ngIf="context.voucherMasterType=='purchase'">Pay</span>
                        <span class="text-success _500" *ngIf="context.voucherMasterType=='sale'">Pending Receipt</span>
                       {{context.foreignBalance | voucherCurrency : context.currencyCode}}
                    </a>
                    <a *ngSwitchDefault>--</a>
                </div>
            </li>
        </ul>
        <ng-template #content>
            <div class="m-0 w w-auto">
                <p class="m-0"><a class="text-primary"></a></p>
                <table class="table small-table text-xs">
                    <thead>
                        <tr>
                          <th>Voucher No</th>
                          <th><span>Name</span></th>
                          <th><span class="float-right">Due</span></th>
                          <th><span class="float-right">Trxn Amount</span></th>
                          <th><span class="float-right">Balance</span></th>
                          <th><span class="float-right">Reference No</span></th>
                          <th><span class="float-right">Date</span></th>
                        </tr>
                    </thead>
                    <tbody>
                    <ng-template ngFor let-row [ngForOf]="context.billToBill" let-j="index">
                      <tr>
                        <td><span>{{row.voucherNo}}</span></td>
                        <td><span>{{ row.trxnItem?.name }} <small>{{ row.trxnItem?.modeName }}</small></span></td>
                        <td><span class="float-right">{{ row.foreignDueAmount | voucherCurrency : row.currencyCode }}</span></td>
                        <td><span class="float-right">{{ row.foreignTrxnAmount | voucherCurrency : row.currencyCode }}</span></td>
                        <td><span class="float-right">{{ row.foreignTrxnBalance | voucherCurrency : row.currencyCode }}</span></td>
                        <td><span class="float-right">{{ row.trxnReferenceNo}}</span></td>
                        <td><span class="float-right">{{ row.trxnDate | dateFormat }}</span></td>
                        <td><span class="float-right">{{ row.trxnBalance | orgCurrency }}</span></td>
                      </tr>
                    </ng-template>
                    </tbody>
              </table>
            </div>
        </ng-template>
    </div>`
})
export class InvoiceStatusGridCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute, private sharedService: SharedService){ super(); }
    createPaymentOrReceipt(row: any) {
      /*const {voucherId, voucherNo, voucherDate, voucherTypeId, voucherMasterType, voucherType, remark} = row;
      let vType = null;
      switch (voucherMasterType) {
          case VOUCHER_TYPES.PURCHASE:
              vType = VOUCHER_TYPES.PAYMENT;
              break;
          case VOUCHER_TYPES.SALE:
              vType = VOUCHER_TYPES.RECEIPT;
              break;
          default:
              break;
      }
      const input = {
          data: {
              refVoucherId: voucherId,
              refVoucherNo: voucherNo,
              refVoucherTypeId: voucherTypeId,
              refVoucherDate: voucherDate,
              refVoucherMasterType: voucherMasterType,
              toInvoiceMasterType: vType
          }
      };
      this.apiResolver.showInvoiceConversionPopup(input, {text: `${vType} for ${voucherType}`, desc: ``});*/
  }
}
