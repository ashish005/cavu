import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";

@Directive()
export class ProductFormComponent{
    customFrom: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customFrom = this.fb.group({
            id: [null],
            validFrom: [''],
            supplyPrice: [''],
            mrp: [''],
            retailPrice: [''],
            isTaxInclusive: [''],
            isFixedPrice: [false],
            isDefaultLoyalty: [''],
            loyaltyPoint: [''],
            adjustedPurchaseCost: [''],
            variant: this.variantFormGroup()
        });
    }

    variantFormGroup(){
        return this.fb.group({
            id: [null],
            productId: [''],
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
    get f() {
        return this.customFrom.controls;
    }

    get formUnitTypeId(){
        return this.formVariant.get('unitTypeId');
    }

    get formVariant(){
        return this.customFrom.get('variant');
    }

    updateUnitType(val){
        this.formUnitTypeId.setValue(val);
    }

    /*populateProductVariant(item: any){
        const { id, isDefaultLoyalty, isFixedPrice, isTaxInclusive, loyaltyPoint, mrp, retailPrice, supplyPrice, validFrom, variant } = item || <ProductPriceVariant>{};
        const { barCode, description, isFeatured, productId, purchaseHoldingQty, reorderLevel, reorderQuantity, sku } = variant;
        this.customFrom.get('id').setValue(id);
        this.customFrom.patchValue(<any>item);
        this.customFrom.get('variant.id').setValue(variant.id);
        this.customFrom.get('variant.productId').setValue(productId);
    }*/
}