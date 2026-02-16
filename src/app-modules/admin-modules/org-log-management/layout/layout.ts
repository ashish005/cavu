import {ChangeDetectorRef, Component, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

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
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                { routeTo: ['error'], icon:"fa fa-inbox", key: "Error Log" },
                { routeTo: ['data'], icon:"fa fa-paper-plane", key: "Data Log" },
                { routeTo: ['org-task'], icon:"fa fa-trash", key: "Org Task Log" },
            ]
        }
    ];

    constructor(public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef){}

    ngAfterContentChecked(){ this.cdref.detectChanges(); }
    onActivate(componentRef) {
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}
