import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {pairwise, startWith} from "rxjs";
import { OrgLookupService, OrgLookup, CalcHelper } from "@app-global";

class TaxCalculationForm {
    calculationForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.calculationForm = this.fb.group(<any>{
            taxMapperId: [null],
            isFixedPrice: [false],
            isTaxInclusive: [false],

            price: [0],

            quantity: [1],
            discountRate: [0],
            taxRate: [0],

            discount: [0],
            taxAmount: [0],
            amount: [0],
            foreign: this.fb.group(<any>{
                discount: [0],
                taxAmount: [0],
                amount: [0],
            })
        });
    }

    get f() { return this.calculationForm.controls; }
    get formIsFixedPrice(): FormGroup { return <FormGroup>this.calculationForm.get('isFixedPrice'); }

    get formTaxMapperId(){ return this.calculationForm.get('taxMapperId'); }
    get formIsTaxInclusive(){ return this.calculationForm.get('isTaxInclusive'); }

    get formQuantity (): FormGroup { return <FormGroup>this.calculationForm.get('quantity'); }
    get formDiscountRate (): FormGroup { return <FormGroup>this.calculationForm.get('discountRate'); }
    get formTaxRate(): FormGroup { return <FormGroup>this.calculationForm.get('taxRate'); }

    get formPrice (): FormGroup { return <FormGroup>this.calculationForm.get('price'); }

    get formDiscountAmount (): FormGroup { return <FormGroup>this.calculationForm.get('discount'); }
    get formTaxAmount (): FormGroup { return <FormGroup>this.calculationForm.get('taxAmount'); }
    get formNetAmount (): FormGroup { return <FormGroup>this.calculationForm.get('amount'); }

    get formSystemDiscountAmount (): FormGroup { return <FormGroup>this.calculationForm.get('foreign.discount'); }
    get formSystemTaxAmount (): FormGroup { return <FormGroup>this.calculationForm.get('foreign.taxAmount'); }
    get formSystemNetAmount (): FormGroup { return <FormGroup>this.calculationForm.get('foreign.amount'); }
}

@Component({
    standalone: false,
    selector: 'add-taxes',
    templateUrl: './templates/add-taxes.html',
})
export class AddTaxesComponent extends TaxCalculationForm implements OnInit {
    @Input() customForm: FormGroup;
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();

    @Input() currencyRate: number;// foreign currency rate
    @Input() currencyCode: string;// foreign currency symbol
    @Input() systemCurrencyCode: string; //System currency symbol
    orgLookup: OrgLookup;
    constructor(public override fb: FormBuilder, public lookupService: OrgLookupService) {
        super(fb);
        this.orgLookup = this.lookupService.getOrgLookup();
    }

    get formPriceQty(){ return this.formPrice.value*this.formQuantity.value; }
    get formSystemPriceQty(){ return this.formPrice.value*this.formQuantity.value*(this.currencyRate || 1); }

    updateTaxMapperDetails(tax_mapper_id){
        if(!tax_mapper_id)
        {
            this.formTaxMapperId.reset();
            this.formIsTaxInclusive.reset();
            this.formTaxRate.reset();
            return
        }
        const { rate } = { rate: 0};//this.resolver.masterType.getTaxMapperById(tax_mapper_id);

        this.formTaxMapperId.setValue(tax_mapper_id, { emitEvent: false });
        this.formTaxRate.setValue(<any>rate);

        const isTaxInclusive: boolean = this.formIsTaxInclusive.value;
        const price: number = this.formPrice.value;
        const taxRate: number = this.formTaxRate.value;
        const qty: number = this.formQuantity.value;
        const discountRate: number = this.formDiscountRate.value;

        const localCalc = CalcHelper.getAmountAndTaxAmount(isTaxInclusive, price, taxRate, qty, discountRate);
        this.formDiscountAmount.setValue(<any>localCalc.discount);
        this.formTaxAmount.setValue(<any>localCalc.taxAmount);
        this.formNetAmount.setValue(<any>localCalc.totalAmount);

        const systemCalc = CalcHelper.getAmountAndTaxAmount(isTaxInclusive, price*this.currencyRate, taxRate, qty, discountRate);
        this.formSystemDiscountAmount.setValue(<any>systemCalc.discount);
        this.formSystemTaxAmount.setValue(<any>systemCalc.taxAmount);
        this.formSystemNetAmount.setValue(<any>systemCalc.totalAmount);
    }

    ngOnInit()
    {
        const itemFormValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                const hasChanges: boolean = (prev?.foreignPrice != next.foreignPrice || prev?.quantity != next.quantity);
                if(hasChanges)
                {
                    const { foreignPrice, quantity, discountRate, taxRate, taxMapperId, isFixedPrice, isTaxInclusive } = next;
                    this.calculationForm.patchValue({
                        taxMapperId: taxMapperId,
                        isFixedPrice: isFixedPrice,
                        isTaxInclusive: isTaxInclusive,

                        price: foreignPrice,

                        quantity: quantity,
                        discountRate: discountRate,
                        taxRate: taxRate
                    });
                }
            }
        };
        this.customForm.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormValueChange);

        /*const fixedPriceChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                if(next)
                {
                    this.formDiscountRate.disable();
                    this.formDiscountAmount.enable();
                } else {
                    this.formDiscountRate.enable();
                    this.formDiscountAmount.disable();
                }
                this.updateTaxCategory(this.formTaxMapperId.value);
            }
        };*/

        const taxInclusiveChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                this.updateTaxMapperDetails(this.formTaxMapperId.value);
            }
        };
        //this.formIsFixedPrice.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(fixedPriceChange);
        this.formIsTaxInclusive.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(taxInclusiveChange);
    }

    updateTaxes()
    {
        const { quantity, discountRate, taxRate, isTaxInclusive} = this.calculationForm.getRawValue();
        this.customForm.get('isTaxInclusive').setValue(isTaxInclusive, { emitEvent: false });
        this.customForm.get('quantity').setValue(quantity, { emitEvent: false });
        this.customForm.get('discountRate').setValue(discountRate, { emitEvent: false });
        this.customForm.get('taxRate').setValue(taxRate, { emitEvent: false });
        this.cb.emit(true);
    }
}