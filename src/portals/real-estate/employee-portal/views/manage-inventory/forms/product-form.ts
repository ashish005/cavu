import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Product} from "../domains/product.serializer";
import {ProductVariant} from "../domains/product-variant.serializer";
import {CategoryLookup, ProductTypeLookup} from "../domains/product.lookup";

@Directive()
export class ProductForm
{
    options: any = { showClear: false };
    customForm: FormGroup;
    variants: Array<ProductVariant>;

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    activeProductType: ProductTypeLookup;
    productTypes: Array<any>;
    activeCategories: Array<CategoryLookup>; //for ui population

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            name: ['', Validators.required],
            shortName: [''],
            code: [''],
            description: [''],
            taxMapperId: [''],
            marginPercentage: [''],
            brandId: [''],
            divisionId: [''],
            vendorId: [''],
            productTypeId: ['', Validators.required],
            supplyTypeId: [''],
            procurementTypeId: [''],
            variants: this.fb.array([]),
            attributes: this.fb.array([]),
            categoryMapper: this.fb.array([]),
            categoryTypeId: [''],

            nature: [''] //Just for UI controlling
        });
    }

    attributesFormGroup(r){
        const { id, attributeTypeId,  attributeTypeValueId, name, value} = r || {};
        return this.fb.group(<any>{
            id: [id],
            attributeTypeId: [attributeTypeId, Validators.required],
            attributeTypeValueId: [attributeTypeValueId],
            name: [name],
            value: [value],
        });
    }

    variantFormGroup(r){
        const { id, name, description, barCode, sku, isFeatured, unitTypeId, purchaseUnitTypeId, purchaseHoldingQty, reorderLevel, reorderQuantity, prices} = r || {};

        const variantForm = this.fb.group(<any>{
            id: [id],
            name: [name],
            description: [description],
            barCode: [barCode],
            sku: [sku],
            isFeatured: [isFeatured],
            unitTypeId: [unitTypeId],
            purchaseUnitTypeId: [purchaseUnitTypeId],
            purchaseHoldingQty: [purchaseHoldingQty],
            reorderLevel: [reorderLevel],
            reorderQuantity: [reorderQuantity],
            prices: this.fb.array([])
        });
        (prices || [{}]).forEach(r => { (<FormArray>variantForm.get('prices')).push(this.variantPriceFormGroup(r)); });
        return variantForm;
    }

    variantPriceFormGroup(price){
        const { id, validFrom, supplyPrice, mrp, retailPrice, isTaxInclusive, isFixedPrice, isDefaultLoyalty, loyaltyPoint, adjustedPurchaseCost, status } = price || {};
        return this.fb.group(<any>{
            id: [id],
            validFrom: [validFrom],
            supplyPrice: [supplyPrice, Validators.required],
            mrp: [mrp],
            retailPrice: [retailPrice],
            isTaxInclusive: [isTaxInclusive],
            isFixedPrice: [isFixedPrice],
            isDefaultLoyalty: [isDefaultLoyalty],
            loyaltyPoint: [loyaltyPoint],
            adjustedPurchaseCost: [adjustedPurchaseCost],
            status: [status],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formProductTypeId(){ return this.customForm.get('productTypeId'); }
    get formProductBrandId(){ return this.customForm.get('brandId'); }
    get formProductDivisionId(){ return this.customForm.get('divisionId'); }
    get formSupplyTypeId(){ return this.customForm.get('supplyTypeId'); }
    get formProcurementTypeId(){ return this.customForm.get('procurementTypeId'); }

    get formProductTaxMapperId(){ return this.customForm.get('taxMapperId'); }
    get formNature(){ return this.customForm.get('nature'); }
    get formCategoryTypeId(){ return this.customForm.get('categoryTypeId'); }

    get formVariants() : FormArray { return this.customForm.get('variants') as FormArray; }
    // Create a getter to cast the controls to FormGroup[]
    get variantControls(): FormGroup[] { return (this.formVariants?.controls as FormGroup[]) || []; }
    get formAttributes() : FormArray { return <FormArray>this.customForm.get('attributes'); }
    get formCategories() : FormArray { return <FormArray>this.customForm.get('categoryMapper'); }

    updateProductType(val){ this.formProductTypeId.setValue(val); }
    updateProductBrand(val){ this.formProductBrandId.setValue(val); }
    updateProductDivision(val){ this.formProductDivisionId.setValue(val); }
    updateSupplyType(val){ this.formSupplyTypeId.setValue(val); }
    updateTaxMapper(val){ this.formProductTaxMapperId.setValue(val); }
    updateProcurementType(val){ this.formProcurementTypeId.setValue(val); }

    addNewVariant(variant){this.formVariants.push(this.variantFormGroup(variant));}
    addNewAttributes(variant){this.formAttributes.push(this.attributesFormGroup(variant));}
    //addNewCategories(variant){this.formCategories.push(this.categoriesFormGroup(variant));}

    onCategoryTypeChange(val)
    {
        this.formCategoryTypeId.setValue(val);
        this.formCategories.controls.length = 0;
        this.formCategories.setValue([]);
    }

    selectedProduct(item: ProductTypeLookup)
    {
        this.activeProductType = item;
        this.formNature.setValue(item.natureType, { emitEvent: false });
        this.formProductTypeId.setValue(item.id, { emitEvent: false });
    }

    populateProduct(item: Product)
    {
        const {
            id, name, shortName, code, description, taxMapperId, marginPercentage,
            brandId, divisionId, vendorId, productTypeId, supplyTypeId, procurementTypeId,
            attributes, nature, categoryMapper, variants, categoryTypeId
        } = item || new Product();
        this.customForm.get('id').setValue(id);
        this.customForm.get('name').setValue(name);
        this.customForm.get('shortName').setValue(shortName);
        this.customForm.get('code').setValue(code);
        this.customForm.get('description').setValue(description);
        this.customForm.get('taxMapperId').setValue(taxMapperId);
        this.customForm.get('marginPercentage').setValue(marginPercentage);
        this.customForm.get('brandId').setValue(brandId);
        this.customForm.get('divisionId').setValue(divisionId);
        this.customForm.get('vendorId').setValue(vendorId);

        this.customForm.get('productTypeId').setValue(productTypeId);
        this.customForm.get('supplyTypeId').setValue(supplyTypeId);
        this.customForm.get('procurementTypeId').setValue(procurementTypeId);
        this.customForm.get('categoryTypeId').setValue(categoryTypeId);

        this.formVariants.controls.length = 0;
        this.formAttributes.controls.length = 0;
        if(!variants?.length){
            [{}].map(r => this.addNewVariant(r));
        } else {
            (variants).map(r => this.addNewVariant(r));
        }

        (attributes || []).map(r => this.addNewAttributes(r));
        this.updateCategory(categoryMapper);
        this.customForm.get('nature').setValue(nature);//Just for UI controlling
    }

    updateCategory(categoryMapperIds: Array<any>){
        this.formCategories.controls.length = 0;
        (categoryMapperIds || []).forEach((val: number) => { this.formCategories.push(this.fb.control(val)); });
    }
}

