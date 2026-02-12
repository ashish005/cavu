import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {StringHelper} from "@app-global";

@Component({
    standalone: false,
    selector:'account-grid-form',
    templateUrl: './templates/account-grid-form.html'
})
export class AccountGridFormComponent implements OnInit {
    @Input() customForm!: FormGroup;
    @Input() orgOption: any;
    get formItems (): FormArray<FormGroup>{ return this.customForm.get('items') as FormArray<FormGroup>; }

    get formTrxn() { return <FormGroup>this.customForm.get('trxn'); }
    get formForeign() { return <FormGroup>this.customForm.get('foreign'); }

    get formVoucherMasterType (): FormGroup { return <FormGroup>this.customForm.get('voucherMasterType'); }

    get formCurrencyRate (): FormGroup { return <FormGroup>this.customForm.get('currencyRate'); }
    get formCurrencyCode (): FormGroup { return <FormGroup>this.customForm.get('currencyCode'); }
    get formCurrencySymbol (): FormGroup { return <FormGroup>this.customForm.get('currencySymbol'); }

    get formSystemCurrencyCode (): FormGroup { return <FormGroup>this.customForm.get('systemCurrencyCode'); }

    @Output() addItem: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeItem: EventEmitter<number> = new EventEmitter<number>();
    public addVoucherItem(){ this.addItem.emit(null); }
    public removeVoucherItem(index: number){ this.removeItem.emit(index); }
    constructor(public fb: FormBuilder) {}
    ngOnInit() {}

    voucherItemCb = (voucherItemForm?: any) => {
        const currencyRate = this.formCurrencyRate.value;
        const amount = voucherItemForm.get('amount').value;

        const f_amount: any = StringHelper.tillDecimalPlaces(amount * currencyRate);
        voucherItemForm.get('foreignAmount').setValue(f_amount);

        this.updateTotal();
    }

    updateTotal(){
        const foreignAmount = this.formItems.value.reduce((total: number, curr: any)=> total + +(curr?.foreignAmount || 0), 0);
        const amount = this.formItems.value.reduce((total: number, curr: any)=> total + +(curr?.amount || 0), 0);
        this.formTrxn.get('amount')?.setValue(amount);
        this.formForeign.get('amount')?.setValue(foreignAmount);
    }

    protected readonly FormGroup = FormGroup;
}