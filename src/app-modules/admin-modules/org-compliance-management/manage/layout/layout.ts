import {ChangeDetectorRef, Component, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ComplianceAPIResolver} from "../services";

@Component({
    standalone: false,
    templateUrl: './layout.html',
    styles: [`::ng-deep ng-component{ display: contents;}`],
})
export class Layout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;

    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children:[
                { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'dashboard' }
            ]
        },
        {
            isFLatChildren: true, key: 'Management',
            children:[
                { routeTo: ['list'], icon:"fa fa-home", key: 'Compliance' },
                { routeTo: ['regulatory'], icon:"fa fa-envelope", key: 'Regulatory' },
            ]
        },
        {
            isFLatChildren: true, key: 'Report',
            children:[
                { routeTo: ['board'], icon:"fa fa-home", key: 'Compliance Board' },
                { routeTo: ['report'], icon:"fa fa-history", key: 'Compliance report' }
            ]
        },
        {
            isFLatChildren: true, key: 'Other',
            children:[
                { routeTo: ['scheduler'], icon:"fa fa-home", key: 'Test Scheduler' }
            ]
        }
    ];

    constructor(public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef, public lookupResolver: ComplianceAPIResolver){}
    ngAfterContentChecked(){ this.cdref.detectChanges(); }
    onActivate(componentRef) {
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    showMasterTypePopup() {
        const data = {};
        this.lookupResolver.showComplianceMasterTypePopup(data,{ text: `Compliance Master`, desc: `Compliance Master` });
    }
}