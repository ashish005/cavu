import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TaxManagementModuleAPIResolver} from "../services";
import {TaxGroupLookup} from "../domains/lookup";

@Component({ templateUrl: './templates/layout.html' })
export class Layout {
  public actionTemplate: TemplateRef<any>;
  public pageTitleTemplate: TemplateRef<any>;
  constructor(private router: Router, public activatedRoute: ActivatedRoute, public apiResolver: TaxManagementModuleAPIResolver){}

  onActivate(componentRef){
    this.actionTemplate = componentRef.actionTemplate;
    this.pageTitleTemplate = componentRef.pageTitleTemplate;
  }

    showAllTaxRates(e) {
        const inputData: any = {
            id: null,
            data: null
        };
        this.apiResolver.showAllTaxRates(inputData, {text: 'Tax Rates - By Groups', desc: 'Current active Organization Tax Rates' });
    }

    createTaxCategory(){
        const inputData: any = {
            id: null,
            data: null
        };
        this.apiResolver.addUpdateTaxCategoryPopup(inputData, { text: `New Tax Category`, desc: 'New Tax Category creation screen' }, ()=>{});
    }
}

@Component({ templateUrl: './templates/sub-layout.html' })
export class SubLayout implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;

    taxGroup: TaxGroupLookup;
    menuItems: Array<any> = [
        { name: 'Manage', sortOrder: 2, route: 'manage', icon: 'fa-list'},
        { name: 'Category', sortOrder: 3, route: 'category', icon: 'fa-table'}
    ];
    page: any;
    activeView: string;
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public apiResolver: TaxManagementModuleAPIResolver){
        this.page = this.activatedRoute.snapshot.data;
    }

    changeRouteTo(item){
        this.router.navigate([item.route], {relativeTo: this.activatedRoute});
    }

    ngOnInit() {}

    onActivate(componentRef) {
        this.activeView = componentRef.activatedRoute.snapshot.routeConfig.path;
        const path = componentRef.activatedRoute.parent.snapshot.params.id;
        if(!path){
            this.taxGroup = new TaxGroupLookup({ name: 'All'});
        } else {
            this.taxGroup = this.apiResolver.masterType.taxGroups.find(r => r.id == path);
        }
        this.page = componentRef.activatedRoute.snapshot.data;
    }

    onTaxGroupChange(taxGroup){
        this.taxGroup = taxGroup;
        this.router.navigate([ this.taxGroup?.id || 'all', this.activeView], { relativeTo: this.activatedRoute.parent });
    }
}