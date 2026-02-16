import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {OrgCurrency, OrgCurrencyQueryOptions} from "../../domains/org-currency.serializer";
import {OrgCurrencyService} from "../../services/org-currency.service";
import {OrgSetupAPIResolver} from "../../services/api.resolver";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
    standalone: false,
    templateUrl: `./templates/org-currency.html`
})
export class OrgCurrencyView extends ViewExtender<OrgCurrency> implements OnInit {
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
    override ngOnDestroy(){ super.ngOnDestroy(); }

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