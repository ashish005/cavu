import {Component, EventEmitter, Injector, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {VoucherService} from "../services/voucher.service";
import {FinancialVoucherExtension} from "../extension/voucher-form.extension";
import {VOUCHER_TYPES} from "@app-global";

const translatePath = 'modules.project.sub_module';
@Component({
    selector: 'voucher-ce',
    standalone: false,
    templateUrl: './templates/voucher.html',
    providers: [VoucherService],
    styles: [`:host { display: contents; } ::ng-deep .w-specific { width: 150px} input, select { height: 20px }`]
})
export class VoucherLayout extends FinancialVoucherExtension {
    @Output() onOk: EventEmitter<boolean> = new EventEmitter<boolean>();

    voucherService: VoucherService;
    constructor(public override fb: FormBuilder,
                public router: Router, public activatedRoute: ActivatedRoute,
                public override injector: Injector) {
        super(fb, injector);
        this.voucherService = injector.get(VoucherService);
        //this.resolver = injector.get(FinancePluginResolver);
    }
    get formIsReferenceNoRequired() { return <FormGroup>this.formTrxn.get('isReferenceNoRequired'); }

    public populateVoucherByMasterType = (voucherMasterType) => super.populateVoucher(this.getDefaultVoucher(voucherMasterType));
    public populateVoucherById = (voucherMasterType, voucherId) => this.voucherService.
        getVoucherDetails(voucherMasterType, voucherId).subscribe((resp) => {}, (resp) => { });


    routeToUrl=(item)=> this.router.navigate([item.key], {relativeTo: this.activatedRoute.parent});

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) { return; }
        const success = (resp: any) => { this.submitted = false; this.onOk.emit(true); };
        const failure = () => { this.submitted = false; };

        const value = form.getRawValue();
        const voucherId = value.voucherId;

        const getPendingBalance=()=>
        {
            const { amount, billToBillTrxn } = value;
            return amount || 0 - (billToBillTrxn || []).reduce(function(result, curr) { return result + curr.trxnAmount; }, 0);
        };
        //value.sundryDetails = value.sundryDetails.filter(r => r.sundryTypeId > 0);
        const voucherMasterType = value.voucherMasterType;
        if(voucherMasterType == 'payment' || voucherMasterType == 'receipt')
        {
            const trxn = value.trxn;
            value.billToBillTrxn = [];
            const dueAmount = getPendingBalance();//this.voucherWrapr.getPendingBalance()
            const foreignAmount = trxn.foreignAmount;
            const trxnAmount = foreignAmount*value.currencyRate;//System currency
            value.billToBillTrxn.push(<any>
                {
                    voucherId: value.refVoucherId,
                    voucherTypeId: value.refVoucherTypeId,
                    dueAmount: dueAmount,
                    trxnAmount: <any>Math.abs(trxnAmount).toFixed(2)
                });

            value.trxn.balance = dueAmount - trxnAmount;

            value.subTotal = null;
            value.discount = null;
            value.taxAmount = null;

            value.amount = trxnAmount;// Override amount as per transaction
        }

        if (value.voucherMasterType == VOUCHER_TYPES.SALE && value.trxn.modeId){
            value.voucherMasterType = 'saleReceipt';
        }
        if (value.voucherMasterType == VOUCHER_TYPES.PURCHASE && value.trxn.modeId){
            value.voucherMasterType = 'purchasePayment';
        }
        //if(this.schedule){ value.schedule = this.schedule; }

        const payload = value;
        this.submitted = true;
        if(voucherId) {
            this.updateVoucher(voucherId, payload).then(success, failure);
        } else {
            this.createVoucher(payload).then(success, failure);
        }
    }
    protected createVoucher = (value: any) => this.voucherService.create(value).toPromise();
    protected updateVoucher = (voucherId: number, value: any) => this.voucherService.update(voucherId, value).toPromise();
}