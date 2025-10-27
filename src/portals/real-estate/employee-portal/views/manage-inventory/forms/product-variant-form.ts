import {Directive, EventEmitter, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductPriceVariant, ProductVariant} from "../domains/product-variant.serializer";

@Directive()
export class ProductPriceVariantForm{
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            validFrom: [''],
            supplyPrice: [''],
            mrp: [''],
            retailPrice: [''],
            isTaxInclusive: [''],
            isFixedPrice: [''],
            isDefaultLoyalty: [''],
            loyaltyPoint: [''],
            adjustedPurchaseCost: [''],
            variant: this.variantFormGroup()
        });
    }

    variantFormGroup(){
        return this.fb.group({
            id: [null],
            productId: ['', Validators.required],
            name: [null, Validators.required],
            description: [''],
            barCode: [null],
            sku: [''],
            isFeatured: [''],
            unitTypeId: [''],
            //purchaseUnitTypeId: [''],
            purchaseHoldingQty: [''],
            reorderLevel: [''],
            reorderQuantity: [''],
        });
    }

    // convenience getter for easy access to form fields
    get f() {  return this.customForm.controls; }

    get formUnitTypeId() { return this.formVariant.get('unitTypeId'); }

    get formProductId(){ return this.formVariant.get('productId'); }

    get formVariant(){ return this.customForm.get('variant'); }

    updateUnitType(val){ this.formUnitTypeId.setValue(val); }

    updateProduct(val){ this.formProductId.setValue(val); }

    populateProductVariant(item: any){ this.customForm.patchValue(<any>item); }
}

@Directive()
export class ProductVariantForm{
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            id: [null],
            productId: ['', Validators.required],
            name: [null, Validators.required],
            description: [''],
            barCode: [null],
            sku: [''],
            isFeatured: [''],
            unitTypeId: [''],
            purchaseUnitTypeId: [''],
            purchaseHoldingQty: [''],
            reorderLevel: [''],
            reorderQuantity: [''],
            prices: this.fb.array([])
        });
    }

    variantPriceFormGroup(data){
        const { id, validFrom, supplyPrice, mrp, retailPrice, isTaxInclusive, isFixedPrice, isDefaultLoyalty, loyaltyPoint, adjustedPurchaseCost, status} = data || {};
        return this.fb.group({
            id: [id],
            validFrom: [validFrom],
            supplyPrice: [supplyPrice],
            mrp: [mrp],
            retailPrice: [retailPrice],
            isTaxInclusive: [isTaxInclusive],
            isFixedPrice: [isFixedPrice],
            isDefaultLoyalty: [isDefaultLoyalty],
            loyaltyPoint: [loyaltyPoint],
            adjustedPurchaseCost: [adjustedPurchaseCost],
            status: [status]
        });
    }

    // convenience getter for easy access to form fields
    get f() {  return this.customForm.controls; }

    get formUnitTypeId() { return this.customForm.get('unitTypeId'); }

    get formProductId(){ return this.customForm.get('productId'); }

    get formVariantPrices() : FormArray { return this.customForm.get('prices') as FormArray; }
    // Create a getter to cast the controls to FormGroup[]
    get priceControls(): FormGroup[] { return this.formVariantPrices.controls as FormGroup[]; }

    addNewPrice(variantPrice){this.formVariantPrices.push(this.variantPriceFormGroup(variantPrice));}

    updateUnitType(val){ this.formUnitTypeId.setValue(val); }

    updateProduct(val){ this.formProductId.setValue(val); }

    populateProductVariant(item:  ProductVariant){
        this.customForm.patchValue(<any>item);
        this.formVariantPrices.controls.length = 0;
        if(!item?.prices?.length)
        {
            ([new ProductPriceVariant()]).map(r => this.addNewPrice(r));
        } else {
            (item?.prices).map(r => this.addNewPrice(r));
        }
    }
}
