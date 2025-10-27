import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ProductLookupResolver } from "../services/api.resolver";
import {ProductVariantService} from "../services/product.service";
import {ProductVariantForm} from "../forms";
import {ProductVariant} from "../domains/product-variant.serializer";

@Component({
    selector: 'product-variant-ce',
    templateUrl: `./templates/product-variant-ce.html`,
    styles: [`:host { display: contents;}`],
  standalone: false
})
export class ProductVariantCEComponent extends ProductVariantForm implements OnInit{
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() productId: any;
    @Input() set data(item: ProductVariant) { super.populateProductVariant(item || new ProductVariant()); };
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public override fb: FormBuilder,
                public apiResolver: ProductLookupResolver,
                private service: ProductVariantService) { super(fb); }

    ngOnInit(){ this.formProductId.setValue(this.productId); }

    variantCallback(e: { refresh: boolean }) {}

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit(resp);
        };
        const error = (resp)=> {
            this.submitted = false;
        };
        this.submitted = true;
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, form.value).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(form.value).subscribe(success, error);
        }
    }
}
