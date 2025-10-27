import {AfterViewInit, Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html'
})
export class AccountingLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    constructor(public router: Router, public activatedRoute: ActivatedRoute){}

    ngOnInit(){
        // this.apiResolver.activeConvType.subscribe(r => {
        //     this.activeConvType = r;
        // });
    }

    onActivate(componentRef){ this.actionTemplate = componentRef.actionTemplate; }
    searchActionCb(row: any){
    }
}
