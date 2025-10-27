import {AfterViewInit, Component, Directive, Injector, OnDestroy, OnInit, TemplateRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({ template: '<router-outlet></router-outlet>', standalone: false })
export class LayoutComponent {
    public componentTemplateRef: TemplateRef<any>;
    public options: any = { showClear: false };
    activeGlobalFilter: any;
    layoutSetting: { aside: boolean, navMenu: boolean }  = { aside: true, navMenu: false };
    constructor(public injector: Injector,
                public router: Router,
                public activatedRoute: ActivatedRoute){
    }

    items: Array<any> = [
        { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'mainLayout.dashboard' },
        { routeTo: ['services'], icon:"fa fa-dashboard", key: 'mainLayout.services' },
        { routeTo: ['executives'], icon:"fa fa-dashboard", key: 'mainLayout.executives' },
        { routeTo: ['invoice'], icon:"fa fa-dashboard", key: 'mainLayout.invoice' },
        { routeTo: ['purchase-order'], icon:"fa fa-dashboard", key: 'mainLayout.purchase_order' }
    ];
}
