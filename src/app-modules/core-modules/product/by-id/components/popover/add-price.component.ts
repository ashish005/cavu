import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductByIdService} from "../../services/product.service";
import {ProductPriceVariant} from "../../domains/variant.serializer";

@Component({
  standalone: false,
    selector: 'add-price',
    templateUrl: './templates/add-price.html'
})
export class AddVariantPriceComponent implements OnInit {
    @Input() variant: any;

    submitted: boolean =  false;
    actionType: string;

    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public fb: FormBuilder, private service: ProductByIdService)
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
