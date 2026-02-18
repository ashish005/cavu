import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TaxManagementModuleAPIResolver} from "../services";
import {TaxGroupLookup} from "../domains/lookup";

@Component({
    standalone: false,
    templateUrl: './templates/layout.html'
})
export class Layout {
  public actionTemplate: TemplateRef<any>;
  public pageTitleTemplate: TemplateRef<any>;

  public actionLayoutTemplate: TemplateRef<any>;
  public pageLayoutTitleTemplate: TemplateRef<any>;

  public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children:[
                { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'dashboard' },
                { routeTo: ['setup'], icon:"fa fa-bell", key: 'Setup' }
            ]
        }
    ];
  constructor(private router: Router, public activatedRoute: ActivatedRoute, public apiResolver: TaxManagementModuleAPIResolver){}

  onActivate(componentRef){
    this.pageLayoutTitleTemplate = componentRef.pageTitleTemplate;
   this.actionLayoutTemplate = componentRef.actionTemplate;
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

@Component({
    standalone: false,
    templateUrl: './templates/sub-layout.html'
})
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