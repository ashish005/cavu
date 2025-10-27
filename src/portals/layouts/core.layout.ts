import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  templateUrl: './templates/core.html',
  styles: [`::ng-deep ng-component{ display: contents;}`],
  standalone: false
})
export class CoreLayout {
  public navList: Array<any>;
    constructor(public router: Router, public activatedRoute: ActivatedRoute,
                private cdref: ChangeDetectorRef){
    }
    onActivate(componentRef) {
      this.navList = componentRef.navList
    }
    ngAfterContentChecked() { this.cdref.detectChanges(); }
}
