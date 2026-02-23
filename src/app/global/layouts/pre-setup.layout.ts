import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";

@Component({
  templateUrl: './templates/pre-setup.html',
  styles: [`::ng-deep ng-component{ display: contents;}`],
    standalone: false
})
export class PreSetupLayout {
    public navList: Array<any> = [];
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef){}
    ngAfterContentChecked(){ this.cdref.detectChanges(); }
}
