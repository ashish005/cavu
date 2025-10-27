import {ActivatedRoute, Router} from "@angular/router";
import {Component, TemplateRef} from "@angular/core";
import {ProductLookupResolver} from "../services/api.resolver";

@Component({
  templateUrl: './templates/layout.html',
  standalone: false,
})
export class ProductLayout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    constructor(private router: Router, public activatedRoute: ActivatedRoute, public apiResolver: ProductLookupResolver){}

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    showMasterTypePopup() {
        const data = {};
        this.apiResolver.showMasterTypePopup(data,{ text: `Product Master`, desc: `Product Master` });
    }
}
