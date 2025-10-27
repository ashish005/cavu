import {ActivatedRoute, Router} from "@angular/router";
import {Component, TemplateRef} from "@angular/core";
import {ProductExtensionFactory} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html'
})
export class ProductLayout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    constructor(private router: Router, public activatedRoute: ActivatedRoute, public factory: ProductExtensionFactory){}

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    showMasterTypePopup() {
        const data = {};
        this.factory.showMasterTypePopup(data,{ text: `Product Master`, desc: `Product Master` });
    }
}
