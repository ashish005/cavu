import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductByIdService} from "../services/product.service";
import {ProductExtensionFactory} from "../services/extension.factory";
import {ProductById} from "../domains/product-id.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/side-nav-layout.html'
})
export class ProductSideNavLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    product: ProductById;

    constructor(private router: Router, public activatedRoute: ActivatedRoute,
                public service: ProductByIdService, public factory: ProductExtensionFactory){}

    ngOnInit(){
        this.product = this.service.product;
    }
    goBack(){
        this.router.navigate(['..'], {relativeTo: this.activatedRoute.parent});
    }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    routerChange(nav){
        this.router.navigate([nav.route], { relativeTo: this.activatedRoute});
    }

    navigateToModule(nav)
    {
        const v = this.router.url.split('/');
        v[v.length-2] = nav.id;
        let lastPath = v[v.length-1];
        this.router.navigate(['../',nav.id, lastPath], { relativeTo: this.activatedRoute});
    }
}
