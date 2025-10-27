import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductVariantService} from "../services/product.service";
import {ProductLookupResolver} from "../../common";

@Component({
  standalone: false,
    selector: '[variant-price-row-ce]',
    templateUrl: `./templates/variant-price-row-ce.html`,
    //styles: [`:host { display: contents;}`]
})
export class ProductVariantPriceRowCeComponent
{
    @Input() customForm: FormGroup;
    @Input() submitted: boolean;
    constructor(public fb: FormBuilder,
                public apiResolver: ProductLookupResolver,
                private service: ProductVariantService) {
    }
    get f() {  return this.customForm.controls; }
}
