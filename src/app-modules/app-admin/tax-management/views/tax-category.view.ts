import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {TaxCategory, TaxCategoryQueryOptions} from "../domains/tax-category.serializer";
import {TaxManagementModuleAPIResolver, TaxCategoryService} from "../services";
import {TaxGroupLookup} from "../domains/lookup";
import {take} from "rxjs";
import {TaxRateMapperCellComponent} from "../grid-cells/tax-category-grid.cell";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({ templateUrl: './templates/tax-category.html', styles: [`:host{ display: contents; }`] })
export class TaxCategoryView extends ViewExtender<TaxCategory> implements OnInit, OnDestroy {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  taxGroup: TaxGroupLookup;
  override coreState: TaxCategoryQueryOptions = new TaxCategoryQueryOptions();
  constructor(public override activeRoute: ActivatedRoute,
              public override service: TaxCategoryService,
              public apiResolver: TaxManagementModuleAPIResolver) {
    super(activeRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'name'},
          {headerName: 'Tax Code', field: 'taxCode' },
          {headerName: 'Tax Group', field: 'taxGroup'},
          {headerName: 'Tax Rates', class: 'text-center', cellTemplate: TaxRateMapperCellComponent},
          {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
      ];
      this.activeRoute.parent.paramMap.subscribe((params: ParamMap) => {
          const id: any = +params.get('id');
          this.taxGroup = this.apiResolver.masterType.taxGroups.find(r => r.id == id);
          this.coreState.taxGroupId = this.taxGroup?.id;
          this.populateGrid();
      })
  }

  ngOnInit() {
  }

  ngOnDestroy(){ super.ngOnDestroy(); }

  refresh=()=>{
    super.populateGrid();
  }

  actionCb(data){
    const inputData: any = {
      id: data.id,
      data: data
    };
    this.apiResolver.addUpdateTaxCategoryPopup(inputData, { text: `${data.name}`, desc: `Update changes for ${data.name}` }, this.refresh);
  }
}
