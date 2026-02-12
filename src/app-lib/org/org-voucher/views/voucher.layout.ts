import {Component, EventEmitter, Injector, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {VoucherService} from "../services/voucher.service";
import {FinancialVoucherExtension} from "../extension/voucher-form.extension";
import {VOUCHER_TYPES, VOUCHER_STATUS} from "@app-global";

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

    onCurrencyChange(event: any) {
        const currencyCode = event.target.value;
        const currency = this.orgLookup.getOrgCurrency(currencyCode);
        if (currency) {
            this.customForm.patchValue({
                currencyId: currency.id,
                currencySymbol: currency.symbol,
                currencyCode: currency.currencyCode
            });
            
            // If it's system currency, rate is 1
            if (currency.id === this.systemCurrency?.id) {
                 this.customForm.patchValue({ currencyRate: 1 });
            }
        }
    }
    
    get hasForeignCurrency() {
        return this.customForm.get('currencyId')?.value !== this.systemCurrency?.id;
    }

    public populateVoucherByMasterType = (voucherMasterType: string) => super.populateVoucher(this.getDefaultVoucher(voucherMasterType));
    public populateVoucherById = (voucherMasterType: string, voucherId: number) => this.voucherService.
        getVoucherDetails(voucherMasterType, voucherId).subscribe((resp: any) => {}, (resp: any) => { });


    routeToUrl=(item: any)=> this.router.navigate([item.key], {relativeTo: this.activatedRoute.parent});

    submitForm(form: FormGroup, createNew: boolean = false) {
        // stop here if form is invalid
        if (form.invalid) { return; }

        // Capture current state for "Save & New"
        const currentCurrencyId = this.customForm.get('currencyId')?.value;
        const currentCurrencyRate = this.customForm.get('currencyRate')?.value;
        const currentCurrencyCode = this.customForm.get('currencyCode')?.value;
        const currentCurrencySymbol = this.customForm.get('currencySymbol')?.value;
        const isForeign = currentCurrencyId !== this.systemCurrency?.id;

        const success = (resp: any) => { 
            this.submitted = false; 
            if (createNew) {
                const masterType = this.voucherType.masterType;
                const voucherData = this.getDefaultVoucher(masterType);
                
                // Persist currency settings for consecutive entry
                if (isForeign) {
                    voucherData.currencyId = currentCurrencyId;
                    voucherData.currencyRate = currentCurrencyRate;
                    voucherData.currencyCode = currentCurrencyCode;
                    voucherData.currencySymbol = currentCurrencySymbol;
                }
                
                this.populateVoucher(voucherData);
                this.customForm.markAsPristine();
                this.customForm.markAsUntouched();
            } else {
                this.onOk.emit(true); 
            }
        };
        const failure = () => { this.submitted = false; };

        const value = form.getRawValue();
        const voucherId = value.voucherId;

        const getPendingBalance=()=>
        {
            const { amount, billToBillTrxn } = value;
            return amount || 0 - (billToBillTrxn || []).reduce(function(result: number, curr: any) { return result + curr.trxnAmount; }, 0);
        };
        //value.sundryDetails = value.sundryDetails.filter(r => r.sundryTypeId > 0);
        const voucherMasterType = value.voucherMasterType;
        if(voucherMasterType == 'payment' || voucherMasterType == 'receipt')
        {
            const trxn = value.trxn;
            value.billToBillTrxn = [];
            const dueAmount = getPendingBalance();//this.voucherWrapr.getPendingBalance()
            const foreignAmount = value.foreign?.amount || trxn.foreignAmount;
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

        // Ensure backend compatibility
        value.foreignAmount = value.foreign?.amount || 0;
        value.netAmount = value.amount;
        value.currencyId = Number(value.currencyId);
        value.currencyRate = Number(value.currencyRate);
        
        value.voucherStatus = value.inDraft ? VOUCHER_STATUS.PENDING : VOUCHER_STATUS.COMPLETED;

        const payload = value;
        this.submitted = true;
        if(voucherId) {
            this.updateVoucher(voucherId, payload).then(success, failure);
        } else {
            this.createVoucher(payload).then(success, failure);
        }
    }

    submitAndNew() {
        this.submitForm(this.customForm, true);
    }

    onSubmit(form: any) {
        this.submitForm(form, false);
    }
    protected createVoucher = (value: any) => this.voucherService.create(value).toPromise();
    protected updateVoucher = (voucherId: number, value: any) => this.voucherService.update(voucherId, value).toPromise();
}