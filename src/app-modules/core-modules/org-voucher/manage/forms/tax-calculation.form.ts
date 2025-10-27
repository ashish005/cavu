import {FormBuilder, FormGroup} from "@angular/forms";

export class TaxCalculationForm {
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