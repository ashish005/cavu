import {Component, Injector, OnDestroy, OnInit, TemplateRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  template: `<router-outlet (activate)='onActivate($event)'></router-outlet>`,
  styles: [`::ng-deep ng-component{ display: contents;}`],
  standalone: false
})
export class MainLayout implements OnInit {
  constructor(public injector: Injector, public router: Router, public activatedRoute: ActivatedRoute){}
  ngOnInit() {}
  onActivate(componentRef){}
}
