import {Directive, EventEmitter, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Directive()
export class ProductTokenForm {
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            userId: [''],
            productId: [''],
            number: [''],
            quantity: [''],
            applicableFor: [''],
            tokenTypeId: [''],
            value: [''],
            details: this.productTokenDetailsFormGroup()
        });
    }

    productTokenDetailsFormGroup(){
        return this.fb.group({
            id: [null],
            userId: [null],
            distributeDate: [null],
            distributeBy: [''],
            returnedDate: [null],
            returnedBy: [''],
            validTillDate: [''],
            isCancelled: ['']
        });
    }

    // convenience getter for easy access to form fields
    get f() {  return this.customForm.controls; }

    get formTokenTypeId() { return this.customForm.get('tokenTypeId'); }

    get formProductId(){ return this.customForm.get('productId'); }

    get formDetail(){ return this.customForm.get('details'); }

    updateTokenTypeId(val) { this.formTokenTypeId.setValue(val); }

    populateProductToken(item: any){ this.customForm.patchValue(<any>item); }
}