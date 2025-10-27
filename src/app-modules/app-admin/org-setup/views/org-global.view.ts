import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {OrgCurrency, OrgCurrencyQueryOptions} from "../domains/org-currency.serializer";
import {OrgCurrencyService} from "../services/org-currency.service";
import {OrgLanguageService} from "../services/org-language.service";
import {OrgLanguage, OrgLanguageQueryOptions} from "../domains/org-language.serializer";
import {OrgSetupAPIResolver} from "../services/api.resolver";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
    templateUrl: `./templates/global/org-currency.html`
})
export class OrgCurrencyView extends ViewExtender<OrgCurrency> implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('routerActionTemplate', { static: true }) public routerActionTemplate: TemplateRef<any>;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    override coreState: OrgCurrencyQueryOptions = new OrgCurrencyQueryOptions();
  constructor(public router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: OrgCurrencyService,
              public apiResolver: OrgSetupAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Code', field: 'currencyCode' },
            {headerName: 'Symbol', field: 'symbol' },
            {headerName: 'Displayed', field: 'isDisplayed', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Enabled', field: 'isEnabled', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Status', field: 'status' }
        ]
    }

    ngOnInit(){ super.populateGrid(); }
    ngOnDestroy(){ super.ngOnDestroy(); }

    add(row){
        const { id, isDisplayed, isDefault, name, currencyCode, symbol } = row;
        //event.checked = !!this.context[this.col.field];
        const data =  {
            currencyId: id,
            isEnabled: true,
            isDisplayed: isDisplayed,
            isDefault: isDefault,
            name: name,
            currencyCode: currencyCode,
            symbol: symbol
        };

        this.isLoading = true;
        const success =(resp)=> {
            this.isLoading = false;
            super.populateGrid();
        };
        const failure =(resp)=> { this.isLoading = false; };
        this.service.addOrgCurrency(id, data).toPromise().then(success, failure);
    }
    actionCb(row){
    }
}

@Component({
    templateUrl: `./templates/global/org-language.html`
})
export class OrgLanguageView extends ViewExtender<OrgLanguage> implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('routerActionTemplate', { static: true }) public routerActionTemplate: TemplateRef<any>;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public router: Router, public activatedRoute: ActivatedRoute,
                public service: OrgLanguageService, public apiResolver: OrgSetupAPIResolver) {
        super(new OrgLanguageQueryOptions(), activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Culture Code', field: 'cultureCode' },
            {headerName: 'Enabled', field: 'isEnabled', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Status', field: 'status' }
        ]
    }

    ngOnInit(){ super.populateGrid(); }
    ngOnDestroy(){ super.ngOnDestroy(); }

    add(row){
        const { id, isDisplayed, isDefault, name, languageCode, cultureCode } = row;
        const data =  {
            languageId: id,
            name: name,
            languageCode: languageCode,
            cultureCode: cultureCode,
            isEnabled: true,
            isDefault: isDefault,
        };

        this.isLoading = true;
        const success =(resp)=> {
            this.isLoading = false;
            super.populateGrid();
        };
        const failure =(resp)=> { this.isLoading = false; };
        this.service.addOrgLanguage(id, data).toPromise().then(success, failure);
    }

    actionCb(row){
    }
}

// @Component({
//     template: `<div class="d-flex flex">
//     <div class="d-flex flex-column flex">
//         <gc-currency #currency></gc-currency>
//     </div>
//     <div class="d-flex flex-column flex">
//         <gc-language #currency></gc-language>
//     </div>
// </div>`
// })
// export class OrgGlobalCombinedView implements OnInit{
//     ngOnInit(){}
// }
//
// @Component({
//     selector: 'gc-language',
//     templateUrl: `./templates/global/gc-language.html`,
//     styles: [`:host { display: contents;}`]
// })
// export class GlobalCombinedLanguageComponent extends ViewExtender<OrgLanguage> implements OnInit {
//     @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
//     constructor(public activatedRoute: ActivatedRoute, public service: OrgLanguageService, public sharedService: SharedService) {
//         super(new OrgLanguageQueryOptions(), activatedRoute, service);
//         this.gridOptions.header.edit = false;
//         this.gridOptions.columnDefs = [
//             {headerName: 'Name', field: 'name' },
//             {headerName: 'Culture Code', field: 'cultureCode' },
//             // {headerName: 'Enabled', field: 'isEnabled', cellTemplate: EnabledCurrencyCheckCell },
//         ]
//     }
//     ngOnInit(){ super.populateGrid(); }
//     ngOnDestroy(){ super.ngOnDestroy(); }
// }
//
// @Component({
//     selector: 'gc-currency',
//     templateUrl: `./templates/global/gc-currency.html`,
//     styles: [`:host { display: contents;}`]
// })
// export class GlobalCombinedCurrencyComponent extends ViewExtender<OrgCurrency> implements OnInit {
//     @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
//     constructor(public activatedRoute: ActivatedRoute, public service: OrgCurrencyService, public sharedService: SharedService) {
//         super(new OrgCurrencyQueryOptions(), activatedRoute, service);
//         this.gridOptions.header.edit = false;
//         this.gridOptions.columnDefs = [
//             {headerName: 'Name', field: 'name' },
//             {headerName: 'Symbol', field: 'symbol' },
//             //{headerName: 'Enabled', field: 'isEnabled', cellTemplate: EnabledCurrencyCheckCell }
//         ]
//     }
//     ngOnInit(){ super.populateGrid(); }
//     ngOnDestroy(){ super.ngOnDestroy(); }
// }
