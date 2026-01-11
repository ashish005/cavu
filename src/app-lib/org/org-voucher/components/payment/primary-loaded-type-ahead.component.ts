import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter, Injector,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {pairwise, startWith} from "rxjs";
import {ModeExtension} from "./mode.extension";
import {ModeGatewayMapper} from "./model/payment-mode";
import {StringHelper} from "@app-global";

@Component({
    standalone: false,
    selector: 'primary-payment-receipt-loaded-type-ahead',
    templateUrl: './templates/primary-loaded-type-ahead.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryLoadedTypeAheadComponent extends ModeExtension implements OnInit, AfterViewInit {
    submitted: boolean = false;
    constructor(public override injector: Injector, private cdr: ChangeDetectorRef) { super(injector); }
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

                this.formPartyAccountId.setValue(<any>accountId);
                this.formPartyAccountGroupId.setValue(<any>accountGroupId);

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

    ngAfterViewInit() { this.cdr.detectChanges(); }

    onPriceFocusOutEvent(event)
    {
        const amount = this.formTrxnAmount.value;
        const currencyRate = this.formCurrencyRate.value;

        const trxnAmount: any = StringHelper.tillDecimalPlaces(amount * currencyRate);
        this.formTrxnForeignAmount.setValue(trxnAmount);
    }
}