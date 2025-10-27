import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ProductLookupResolver } from "../services/api.resolver";
import {ProductVariantService} from "../services/product.service";

@Component({
    selector: '[variant-price-row-ce]',
    templateUrl: `./templates/variant-price-row-ce.html`,
    //styles: [`:host { display: contents;}`],
  standalone: false
})
export class ProductVariantPriceRowCeComponent
{
    @Input('customForm') customForm: FormGroup;
    @Input() submitted: boolean;
    constructor(public fb: FormBuilder,
                public apiResolver: ProductLookupResolver,
                private service: ProductVariantService) {
    }
    get f() {  return this.customForm.controls; }
}
