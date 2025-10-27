import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductLookupResolver} from "../../services/api.resolver";
import {ProductService} from "../../services/product.service";
import {ProductPriceVariant} from "../../domains/product-variant.serializer";

@Component({
    selector: 'add-price',
    templateUrl: './templates/add-price.html',
  standalone: false
})
export class AddVariantPriceComponent implements OnInit {
    @Input() variant: any;

    submitted: boolean =  false;
    actionType: string;

    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public fb: FormBuilder, public apiResolver: ProductLookupResolver, private service: ProductService)
    {
        this.customForm = this.fb.group({
            id: [null],
            validFrom: [''],
            supplyPrice: ['', Validators.required],
            mrp: [''],
            retailPrice: [''],
            isTaxInclusive: [''],
            isFixedPrice: [''],
            isDefaultLoyalty: [''],
            loyaltyPoint: [''],
            adjustedPurchaseCost: ['']
        });
    }

    ngOnInit(){}

    get f() { return this.customForm.controls; }

    saveForm(form, p){
        // if(this.variant.id)
        // {
        //     this.onOk.emit({  refresh: true, data: form.value });
        //     return;
        // }
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            p.close();
            this.onOk.emit({  refresh: true, data: new ProductPriceVariant(resp.data) });
        };
        const error = (resp)=> {
            this.submitted = false;
        };
        this.submitted = true;
        this.service.createVariantPrice(this.variant.id, form.value).subscribe(success, error);
    }
}
