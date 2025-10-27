import {AfterViewInit, Component, Directive, Injector, OnDestroy, OnInit, TemplateRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  template: '<router-outlet></router-outlet>'
})
export class LayoutComponent {
    constructor(public injector: Injector, public router: Router, public activatedRoute: ActivatedRoute){
    }

    items: Array<any> = [
        { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'mainLayout.dashboard' },
        { routeTo: ['associates'], icon:"fa fa-dashboard", key: 'mainLayout.associates' },
        { routeTo: ['invoice'], icon:"fa fa-dashboard", key: 'mainLayout.invoice' },
        { routeTo: ['quotation'], icon:"fa fa-dashboard", key: 'mainLayout.quotation' },
        { routeTo: ['sale-order'], icon:"fa fa-dashboard", key: 'mainLayout.sale_order' },
    ];

    routeToUrl=(path)=> this.router.navigate([path], {relativeTo: this.activatedRoute.parent});
}
