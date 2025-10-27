import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ProductAPIResolver} from "../services/api.resolver";

@Component({
  templateUrl: './templates/product-form-layout.html',
  standalone: false
})
export class ProductFormLayout {
    public actionTemplate: TemplateRef<any>;
    public footerTemplate: TemplateRef<any>;

    constructor(public fb: FormBuilder,
                private router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: ProductAPIResolver) {
    }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.footerTemplate = componentRef.footerTemplate;
    }

    goBack(){
        this.router.navigate(['../','product'], {relativeTo: this.activatedRoute.parent});
    }
}
