import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {StringHelper} from "@app-global";

@Component({
    standalone: false,
    selector: 'add-round-off',
    templateUrl: './templates/add-round-off.html',
    styles: [`:host .popover {  max-width: 450px; }`]
})
export class AddRoundOffComponent {
    @Input() customForm: FormGroup;
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();

    roundOffType = {
        positive: 'Round off+',
        negative: 'Round off-',
    };
    constructor(public fb: FormBuilder) {}

    get formVoucherPayable (): FormGroup { return <FormGroup>this.customForm.get('payableAmount'); }
    get formForeignPayable (): FormGroup { return <FormGroup>this.customForm.get('foreign.payableAmount'); }
    get formCurrencyRate (): FormGroup { return <FormGroup>this.customForm.get('currencyRate'); }

    clonedPayable: string;
    clonedForeignPayable: string;

    apply(typeOfroundOff){
        if(!this.clonedPayable){
            this.clonedPayable = this.formVoucherPayable.value;
        }
        let amt = this.formVoucherPayable.value;
        if(this.roundOffType.positive == typeOfroundOff){
            amt = Math.ceil(amt);
        } else if (this.roundOffType.negative == typeOfroundOff){
            amt = Math.floor(amt);
        } else if ('na' == typeOfroundOff){
            amt = this.clonedPayable;
        } else {
            amt = Math.round(amt);
        }
        amt = StringHelper.tillDecimalPlaces(Math.abs(amt));
        this.formVoucherPayable.setValue(amt);
        this.formForeignPayable.setValue(StringHelper.tillDecimalPlaces(amt * this.formCurrencyRate.value));
    }
}