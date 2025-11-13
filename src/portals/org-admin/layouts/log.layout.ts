import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  templateUrl: './templates/log-layout.html',
  styles: [`::ng-deep ng-component{ display: contents;}`],
  standalone: false
})
export class LogLayout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children:[
                { routeTo: ['error'], icon:"fa fa-inbox", key: "Error Log" },
                { routeTo: ['data'], icon:"fa fa-paper-plane", key: "Data Log" },
                { routeTo: ['org-task'], icon:"fa fa-trash", key: "Org Task Log" },
            ]
        }
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public cdref: ChangeDetectorRef){}
    ngAfterContentChecked() { this.cdref.detectChanges(); }
    onActivate(componentRef) {}
}
