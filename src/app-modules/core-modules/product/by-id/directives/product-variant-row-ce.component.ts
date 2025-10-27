import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductVariantService} from "../services/product.service";
import {ProductPriceVariant} from "../domains/variant.serializer";
import {ProductLookupResolver} from "../../common";

@Component({
  standalone: false,
    selector: '[variant-row-ce]',
    templateUrl: `./templates/variant-row-ce.html`,
    styles: [`:host { display: contents;}`]
})
export class ProductVariantRowCeComponent implements OnInit
{
    @Input() customForm: FormGroup;
    @Input() submitted: boolean;
    //@Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public fb: FormBuilder,
                public lookupResolver: ProductLookupResolver,
                private service: ProductVariantService) {}

    get f() {  return this.customForm.controls; }

    variantPriceFormGroup(item){
        return this.fb.group({
            id: [item?.id || null],
            validFrom: [item?.id || ''],
            supplyPrice: [item?.supplyPrice || ''],
            mrp: [item?.mrp || ''],
            retailPrice: [item?.retailPrice || ''],
            isTaxInclusive: [item?.isTaxInclusive || ''],
            isFixedPrice: [item?.isFixedPrice || ''],
            isDefaultLoyalty: [item?.isDefaultLoyalty || ''],
            loyaltyPoint: [item?.loyaltyPoint || ''],
            adjustedPurchaseCost: [item?.adjustedPurchaseCost || '']
        });
    }

    get formUnitTypeId() { return this.customForm.get('unitTypeId'); }
    get formProductId(){ return this.customForm.get('productId'); }
    get formPurchaseUnitTypeId(){ return this.customForm.get('purchaseUnitTypeId'); }
    get formVariant(){ return this.customForm.get('variant'); }

  get formVariantPrices() : FormArray { return this.customForm.get('prices') as FormArray; }
  // Create a getter to cast the controls to FormGroup[]
  get priceControls(): FormGroup[] { return this.formVariantPrices.controls as FormGroup[]; }

    addVariantPrices(priceRow){this.formVariantPrices.push(this.variantPriceFormGroup(priceRow));}

    updateUnitType(val){ this.formUnitTypeId.setValue(val); }
    updateProduct(val){ this.formProductId.setValue(val); }
    updatePurchaseUnitType(val){ this.formPurchaseUnitTypeId.setValue(val); }
    ngOnInit(){}

    variantPriceCallback(e: { refresh: boolean, data: ProductPriceVariant })
    {
        if(e.refresh && e.data)
        {
            this.addVariantPrices(e.data);
        } else {

        }
        //this.lookupResolver.triggerGridRefresh();
    }
}
