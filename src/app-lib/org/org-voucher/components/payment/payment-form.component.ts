import {Component, EventEmitter, Injector, Input, OnInit, Output} from "@angular/core";
import {pairwise, startWith} from "rxjs";
import {ModeExtension} from "./mode.extension";
import {ModeGatewayMapper} from "./model/payment-mode";
import {StringHelper} from "@app-global";

@Component({
    standalone: false,
    selector: 'invoice-payment-receipt',
    templateUrl: './templates/payment-receipt-form.html'
})
export class GridPaymentReceiptComponent extends ModeExtension implements OnInit {
    submitted: boolean = false;
    constructor(public override injector: Injector) { super(injector); }
    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    override ngOnInit(){
        super.ngOnInit();

        const itemFormValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                const paymentModeInfo: ModeGatewayMapper = (this.modes || []).find(r => r.id == next);
                this.paymentModeInfo = paymentModeInfo;

                const { id, gatewayId, name, isReferenceNoRequired, modeId, systemTypeId, paymentSystemMaster, accountId, accountGroupId, serviceCharges } = paymentModeInfo;

                this.formPaymentSystemMasterType.setValue(<any>paymentSystemMaster);

                this.formGatewayAccountId.setValue(<any>accountId);
                this.formGatewayAccountGroupId.setValue(<any>accountGroupId);

                this.formTrxnModeId.setValue(<any>modeId);

                this.formIsReferenceNoRequired.setValue(<any>isReferenceNoRequired);

                if (!isReferenceNoRequired) {
                    this.formTrxnReferenceNo.setValue(null);
                    this.formTrxnReferenceNo.disable();
                } else {
                    this.formTrxnReferenceNo.enable();
                }
            }
        };
        this.formPaymentGatewayMapperId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormValueChange);
    }

    onPriceFocusOutEvent(event)
    {
        const amount = this.formTrxnAmount.value;
        const currencyRate = this.formCurrencyRate.value;

        const trxnAmount: any = StringHelper.tillDecimalPlaces(amount * currencyRate);
        this.formTrxnForeignAmount.setValue(trxnAmount);
    }
}