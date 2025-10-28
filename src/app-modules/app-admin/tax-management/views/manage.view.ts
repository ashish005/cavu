import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {TaxManagement, TaxManagementQueryOptions} from "../domains/tax-management.serializer";
import { TaxManagementModuleAPIResolver, TaxManagementService} from "../services";
import {TaxGroupLookup} from "../domains/lookup";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/manage.html',
    styles: [`:host{ display: contents; }`]
})
export class ManageTaxView extends ViewExtender<TaxManagement> implements OnInit, OnDestroy {
  override coreState: TaxManagementQueryOptions = new TaxManagementQueryOptions();
  taxGroup: TaxGroupLookup;
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: TaxManagementService,
              public apiResolver: TaxManagementModuleAPIResolver) {
    super(activatedRoute, service);
      this.gridOptions.header.edit = false;
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'categoryName'},
          {headerName: 'Tax', field: 'name'},
          {headerName: 'Rate', field: 'rate'},
          {headerName: 'Tax Code', field: 'taxCode' },
          {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
      ];
      this.activatedRoute.parent.paramMap.subscribe((params: ParamMap) => {
          const id: any = +params.get('id');
          this.taxGroup = this.apiResolver.masterType.taxGroups.find(r => r.id == id);
          this.coreState.taxGroupId = this.taxGroup?.id;
          this.populateGrid();
      })
  }

  ngOnInit() {}

  override ngOnDestroy(){ super.ngOnDestroy(); }
    actionCb(e){}
}
