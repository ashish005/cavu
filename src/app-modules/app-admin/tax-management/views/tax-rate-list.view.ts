import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {TaxTypeRate, TaxTypeRateQueryOptions} from "../domains/tax-type-rate.serializer";
import {GridUISwitchCellComponent, NameCellComponent, ViewExtender} from "@app-global";
import {TaxManagementModuleAPIResolver, TaxTypeRateService} from "../services";
import {ActivatedRoute} from "@angular/router";
import {TaxRateCellComponent} from "../grid-cells/tax-category-grid.cell";

@Component({
    standalone: false,
  templateUrl: './templates/tax-rate-list.html',
    styles: [`:host{ display: contents; }`]
})
export class TaxRateListComponent extends ViewExtender<TaxTypeRate> implements OnInit {
  override coreState: TaxTypeRateQueryOptions = new TaxTypeRateQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: TaxTypeRateService,
              public apiResolver: TaxManagementModuleAPIResolver) {
    super(activatedRoute, service);
    this.coreState = new TaxTypeRateQueryOptions();
      this.gridOptions.header = { title: 'Tax Rates', hide: true, footerHide: true, desc: 'Tax Rates information here', add: false, refresh: true, edit: false, delete: false };
      this.gridOptions.columnDefs = [
      {headerName: 'Name', field: 'name', cellTemplate: NameCellComponent},
      {headerName: 'Rate', field: 'rate', cellTemplate: TaxRateCellComponent},
      {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
    ];
  }

  ngOnInit() {
    super.populateGrid();
  }

  boxToolCallback(e){}

  changeByTaxGroup(taxGroupId) {
    this.coreState.taxGroupId = taxGroupId;
    super.populateGrid();
  }

    actionCb(e){}
}
