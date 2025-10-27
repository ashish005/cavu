import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductAPIResolver, ProductLookupResolver} from "../services/api.resolver";
import {SharedService} from "@app-global";

@Component({
  templateUrl: './templates/side-nav-layout.html',
  standalone: false
})
export class ProductSideNavLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;

    constructor(private router: Router, public moduleResolver: ProductAPIResolver,
                public apiResolver: ProductLookupResolver,
                public activatedRoute: ActivatedRoute,
                public sharedService: SharedService){}

    ngOnInit(){}
    goBack(){
        this.router.navigate(['../','product'], {relativeTo: this.activatedRoute.parent});
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
