import {Component, Directive, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReportService} from "../services/report.service";
import {ACTION_ENUM} from "@app-global";

@Directive()
export class ProductFormComponent{
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
        return this.customForm.controls;
    }

    get formUnitTypeId(){
        return this.formVariant.get('unitTypeId');
    }

    get formVariant(){
        return this.customForm.get('variant');
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

@Component({
    standalone: false,
    selector: 'add-product',
    templateUrl: './templates/add-product.html',
    styles: [`:host .popover {  max-width: 400px; }`]
})
export class AddProductComponent extends ProductFormComponent {
    submitted: boolean = false;
    @Input() id: any;
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();
    actionType: any = ACTION_ENUM.ADD;

    constructor(public override fb: FormBuilder, private service: ReportService) {
        super(fb);
    }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit({ refresh: true });
        };
        const error = (resp)=> {
            this.submitted = false;
        };
        this.submitted = true;
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            //this.service.updateProduct(this.id, form.value).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.createProduct(form.value).subscribe(success, error);
        }
    }
}