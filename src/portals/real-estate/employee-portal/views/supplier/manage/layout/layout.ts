import {ActivatedRoute, Router} from "@angular/router";
import {Component, TemplateRef} from "@angular/core";

@Component({ templateUrl: './templates/layout.html', standalone: false })
export class SupplierLayout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    constructor(private router: Router, public activatedRoute: ActivatedRoute){}

    navigations = [
        { name: 'By Branch', sortOrder: 1, route: 'branch'},
        { name: 'By Vendor', sortOrder: 2, route: 'view'}
    ];

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    navigateTo(item){
        this.router.navigate([item.route], {relativeTo: this.activatedRoute.parent});
    }
}
