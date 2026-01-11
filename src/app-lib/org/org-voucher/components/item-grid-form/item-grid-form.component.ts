import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {pairwise, startWith} from "rxjs";
import {debounceTime, switchMap, of} from "rxjs";

@Component({
    standalone: false,
    selector:'item-grid-form',
    templateUrl: './templates/item-grid-form.html'
})
export class ItemGridFormComponent implements OnInit {
    @Input() customForm: FormGroup;
    get formItems (): FormArray<FormGroup>{ return this.customForm.get('items') as FormArray<FormGroup>; }

    get formTrxn() { return <FormGroup>this.customForm.get('trxn'); }
    get formForeign() { return <FormGroup>this.customForm.get('foreign'); }

    get formVoucherMasterType (): FormGroup { return <FormGroup>this.customForm.get('voucherMasterType'); }

    get formCurrencyRate (): FormGroup { return <FormGroup>this.customForm.get('currencyRate'); }
    get formCurrencyCode (): FormGroup { return <FormGroup>this.customForm.get('currencyCode'); }
    get formCurrencySymbol (): FormGroup { return <FormGroup>this.customForm.get('currencySymbol'); }

    get formSystemCurrencyCode (): FormGroup { return <FormGroup>this.customForm.get('systemCurrencyCode'); }

    get formTrxnTaxAmount (): FormGroup { return <FormGroup>this.formTrxn.get('taxAmount'); }
    get formTrxnDiscount (): FormGroup { return <FormGroup>this.formTrxn.get('discount'); }
    get formTrxnSubTotal (): FormGroup { return <FormGroup>this.formTrxn.get('subTotal'); }
    get formTrxnAmount (): FormGroup { return <FormGroup>this.formTrxn.get('amount'); }

    //get formTrxnDueAmount (): FormGroup { return <FormGroup>this.formTrxn.get('dueAmount'); }

    get formForeignTaxAmount (): FormGroup { return <FormGroup>this.formForeign.get('taxAmount'); }
    get formForeignDiscount (): FormGroup { return <FormGroup>this.formForeign.get('discount'); }
    get formForeignSubTotal (): FormGroup { return <FormGroup>this.formForeign.get('subTotal'); }
    get formForeignAmount (): FormGroup { return <FormGroup>this.formForeign.get('amount'); }

    //get formForeignDueAmount (): FormGroup { return <FormGroup>this.formForeign.get('balance'); }

    // get formVoucherPayable (): FormGroup { return <FormGroup>this.customForm.get('payableAmount'); }
    // get formForeignPayable (): FormGroup { return <FormGroup>this.customForm.get('foreign.payableAmount'); }

    @Output() addItem: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeItem: EventEmitter<number> = new EventEmitter<number>();
    public addVoucherItem(){ this.addItem.emit(null); }
    public removeVoucherItem(index){ this.removeItem.emit(index); }

    constructor(public fb: FormBuilder) {}
    ngOnInit() {
        const currencyRateChange = ([prev, next]: [number, number]) => {
            if (prev != next) {
                /*const currencyRate: number = next || 1;
                const amount = this.formForeignAmount.value * currencyRate;
                this.formTrxnAmount.setValue(<any>amount);
                this.formVoucherAmount.setValue(<any>amount);*/
                this.formItems.controls.forEach(this.voucherItemCb);
            }
        };
        this.formCurrencyRate.valueChanges.pipe(startWith(null as string), pairwise(), debounceTime(200)).subscribe(currencyRateChange);
    }

    /*updateVoucherSummary = () => {
        const voucherItems = this.formVoucherItems.value;
        const currencyRate = this.formCurrencyRate.value;

        const {
            discount, taxAmount, lineTotal,
            foreignDiscount, foreignTax, foreignLineTotal
        } = (voucherItems || []).reduce((prev, curr) => {
            prev.taxAmount += parseFloat(curr.taxAmount);
            prev.lineTotal += parseFloat(curr.netAmount);
            prev.discount += parseFloat(curr.discount);

            prev.foreignTax += parseFloat(curr.foreignTax);
            prev.foreignLineTotal += parseFloat(curr.foreignAmount);
            prev.foreignDiscount += parseFloat(curr.foreignDiscount);

            // const {taxMapperId} = curr;
            // if (!this.formIsItemInvoice.value || !taxMapperId) {
            //     return prev;
            // }
            //
            // this.addUpdateByTaxMapperSundry(voucherMasterType, taxMapperId, prev.taxAmount);
            return prev;
        }, {
            taxAmount: 0, lineTotal: 0, discount: 0,
            foreignTax: 0, foreignLineTotal: 0, foreignDiscount: 0
        });

        const subTotal: any = lineTotal - taxAmount + discount;
        const foreignSubTotal: any = foreignLineTotal - foreignTax + foreignDiscount;

        this.formVoucherDiscount.setValue(StringHelper.tillDecimalPlaces(discount)); // total discount
        this.formVoucherTaxAmount.setValue(StringHelper.tillDecimalPlaces(taxAmount)); // total tax
        this.formVoucherSubTotal.setValue(StringHelper.tillDecimalPlaces(subTotal));
        this.formVoucherAmount.setValue(StringHelper.tillDecimalPlaces(lineTotal));// item total: after applying discount and tax
        //this.formVoucherRounding.setValue(UtilHelper.tillDecimalPlaces(roundOffValue));

        this.formForeignDiscount.setValue(StringHelper.tillDecimalPlaces(foreignDiscount));
        this.formForeignTax.setValue(StringHelper.tillDecimalPlaces(foreignTax));
        this.formForeignSubTotal.setValue(StringHelper.tillDecimalPlaces(foreignSubTotal));
        this.formForeignAmount.setValue(StringHelper.tillDecimalPlaces(foreignLineTotal));// item total: after applying discount and tax
        //this.formForeignRounding.setValue(UtilHelper.tillDecimalPlaces(foreignRoundOffValue));

        this.formVoucherPayable.setValue(StringHelper.tillDecimalPlaces(lineTotal));
        this.formForeignPayable.setValue(StringHelper.tillDecimalPlaces(foreignLineTotal));

        // const updateBillToBillSummary = () => {
        //     const calcTrxnAmountFn = (result, curr) => result + curr.trxnAmount;
        //     const billToBillTrxn = (this.formBillToBillTrxn.value || []).reduce(calcTrxnAmountFn, 0);
        //
        //     const dueAmount: any = lineTotal - billToBillTrxn;
        //     const foreignDueAmount: any = foreignLineTotal - (billToBillTrxn / currencyRate);
        //
        //     // round off: begins
        //     const wholeVal: any = Math.round(lineTotal);
        //     const roundOffValue: any = Math.round(lineTotal) - lineTotal;
        //     const foreignRoundOffValue = Math.round(foreignLineTotal) - foreignLineTotal;
        //     if (roundOffValue > 0 || roundOffValue < 0) {
        //         this.addUpdateNewSundry(this.formVoucherMasterType.value, 'round_off', 'byKeyValue', roundOffValue);
        //     }
        //     // round off: ends
        //
        //     this.formVoucherBalance.setValue(StringHelper.tillDecimalPlaces(dueAmount));
        //     this.formForeignBalance.setValue(StringHelper.tillDecimalPlaces(foreignDueAmount));
        // };
        //
        // updateBillToBillSummary();
    }*/
    voucherItemCb = (voucherItemForm?: any) => {
        this.updateTotal();
    }

    updateTotal()
    {
        const { taxAmount, discount, subTotal } = (this.formItems.value || []).reduce((result, item)=>{
            const curr = item.product;

            result.taxAmount += +(curr.taxAmount || 0);
            result.discount += +(curr.discount || 0);
            result.subTotal += +(curr.subTotal || 0);
            return result;
        }, { taxAmount: 0, discount: 0, subTotal: 0 });

        const { taxAmount: f_taxAmount, discount: f_discount, subTotal: f_subTotal } = (this.formItems.value || []).reduce((result, item)=>{
            const curr = item.product;

            result.taxAmount += +(curr.foreignTaxAmount || 0);
            result.discount += +(curr.foreignDiscount || 0);
            result.subTotal += +(curr.foreignSubTotal || 0);
            return result;
        }, { taxAmount: 0, discount: 0, subTotal: 0 });
        this.formTrxnTaxAmount.setValue(taxAmount);
        this.formTrxnDiscount.setValue(discount);
        this.formTrxnSubTotal.setValue(subTotal);

        this.formForeignTaxAmount.setValue(f_taxAmount);
        this.formForeignDiscount.setValue(f_discount);
        this.formForeignSubTotal.setValue(f_subTotal);

        this.formTrxnAmount.setValue(subTotal);
        this.formForeignAmount.setValue(f_subTotal);
        //this.formTrxnDueAmount.setValue(balance);
        //this.formForeignDueAmount.setValue(f_balance);
    }
}