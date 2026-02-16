import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";

@Component({
  templateUrl: './templates/setup-layout.html',
  styles: [`::ng-deep ng-component{ display: contents;}`],
    standalone: false
})
export class SetupLayout {
    public navList: Array<any> = [];
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef){}
    ngAfterContentChecked(){ this.cdref.detectChanges(); }
}
