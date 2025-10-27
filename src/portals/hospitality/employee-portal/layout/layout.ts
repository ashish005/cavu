import {Component, Injector, OnDestroy, OnInit, TemplateRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html',
  styles: [`::ng-deep ng-component{ display: contents;}`]
})
export class MainLayout implements OnInit {
    public navList: Array<any>[];
    constructor(public injector: Injector, public router: Router, public activatedRoute: ActivatedRoute){}
    ngOnInit() {}
    onActivate(componentRef){}
}
