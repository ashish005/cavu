import {Component, Input} from "@angular/core";
import {AccountingAPIResolver} from "../services";

@Component({
  standalone: false,
    template: '<a class="text-primary text-xs" (click)="showVoucher()">{{context.voucherNo}}</a>'
})
export class VoucherCellComponent{
    @Input() context: any;
    show: boolean = false;
    constructor(private apiResolver: AccountingAPIResolver){}

    showVoucher(){
        const  {voucherMasterType, voucherType, voucherNo, voucherId, voucherTypeId } = this.context;
        const inputData: any = {
            id: voucherId,
            data: {
                voucherMasterType: voucherMasterType,
                voucherType: voucherType,
                voucherId: voucherId,
                voucherTypeId: voucherTypeId,
                projectId: null,
                customerId: null
            }
        };
        //this.apiResolver.openVoucherPopup(inputData,{ text: `${this.context.voucherNo}`, desc: `` });
    }
}
