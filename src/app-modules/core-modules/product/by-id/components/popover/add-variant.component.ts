import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ProductByIdService} from "../../services/product.service";
import {ProductPriceVariantForm} from "../../forms/product-variant-form";
import {ProductLookupResolver} from "../../../common";

@Component({
  standalone: false,
    selector: 'add-variant',
    templateUrl: './templates/add-variant.html'
})
export class AddVariantComponent extends ProductPriceVariantForm implements OnInit {
    @Input() productId: any;
    submitted: boolean =  false;
    actionType: string;
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();

    constructor(public override fb: FormBuilder, public apiResolver: ProductLookupResolver, private service: ProductByIdService)
    {
        super(fb);
    }

    ngOnInit(){
        this.formProductId.setValue(this.productId);
    }

    get formVariantPrices() : FormArray { return this.customForm.get('prices') as FormArray; }
  // Create a getter to cast the controls to FormGroup[]
  get priceControls(): FormGroup[] { return this.formVariantPrices.controls as FormGroup[]; }

    addPriceCallback(e){

    }

    saveForm(form, p){
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            p.close();
            this.cb.emit({  refresh: true });
        };
        const error = (resp)=> {
            this.submitted = false;
        };
        this.submitted = true;
        this.service.createVariant(this.productId, form.value).subscribe(success, error);
    }
}
