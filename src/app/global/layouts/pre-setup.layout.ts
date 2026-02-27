import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import {AppSetup, AppSetupService} from "../services";

@Component({
  templateUrl: './templates/pre-setup.html',
  styles: [`::ng-deep ng-component{ display: contents;}`],
    standalone: false
})
export class PreSetupLayout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children: [
                {routeTo: ['config'], icon: "fa fa-list-alt", key: "Configuration"},
                {routeTo: ['sync'], icon: "fa fa-book", key: "Sync Org / Branch"}
            ]
        }
    ];
    public appSetup: AppSetup;
    constructor(public setupService: AppSetupService, public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef){
        this.appSetup = setupService.appSetup;
    }
    ngAfterContentChecked(){ this.cdref.detectChanges(); }
    onActivate(componentRef) {
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}
