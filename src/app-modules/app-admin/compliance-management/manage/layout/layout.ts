import {Component, TemplateRef} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ComplianceAPIResolver} from "../services";

@Component({
    standalone: false,
    templateUrl: './layout.html',
    styles: [`::ng-deep ng-component{ display: contents;} :host { display: contents;}`]
})
export class Layout {
    page: any;
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    constructor(public activatedRoute: ActivatedRoute, public lookupResolver: ComplianceAPIResolver){
        this.page = this.activatedRoute.snapshot.data;
    }



    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    showMasterTypePopup() {
        const data = {};
        this.lookupResolver.showComplianceMasterTypePopup(data,{ text: `Compliance Master`, desc: `Compliance Master` });
    }
}