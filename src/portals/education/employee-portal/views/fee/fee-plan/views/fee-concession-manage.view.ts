import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {UserAuditInfoCell, ViewExtender} from "@app-global";
import {
    FeeConcessionType,
    FeeConcessionTypeQueryOptions
} from "../domains/fee-concession.serializer";
import {FeeConcessionTypeService} from "../services/fee-concession.service";

@Component({
    standalone: false,
  templateUrl: './templates/manage-master.html'
})
export class FeeConcessionManageView extends ViewExtender<FeeConcessionType> implements OnInit, OnDestroy
{
  override coreState: FeeConcessionTypeQueryOptions = new FeeConcessionTypeQueryOptions();
  constructor(public override service: FeeConcessionTypeService,
              public override activatedRoute: ActivatedRoute) {
      super(activatedRoute, service);
      const translate_path = 'modules.project.manage.grid';
      this.gridOptions.columnDefs = [
          {headerName: `${translate_path}.name`, field: 'name' },
          {headerName: `Calculation Value`, field: 'calculationValue' },
          {headerName: `Calculation Type`, field: 'calculationTypeName' },
          {headerName: `Category`, field: 'reservationCategoryName' },
          {headerName: `Status`, field: 'status' },
          {headerName: `${translate_path}.audit`, field: 'userAudit', class: 'float-right', cellTemplate: UserAuditInfoCell }
      ];
  }

  ngOnInit(){ super.populateGrid(); }
  override ngOnDestroy(){ super.ngOnDestroy(); }

  actionCb(row: FeeConcessionType){
      const inputData: any = {
          id: row.id,
          data: row
      };

      // this.feePlanFactory.ceConcessionFeePopup(inputData, {text: `${row.name}`, desc: '' }).then(()=>{ this.populateGrid(); });
  }

  createNew(){
      const inputData: any = {
          id: null,
          data: {}
      };
      // this.feePlanFactory.ceConcessionFeePopup(inputData, {text: 'New Concession', desc: '' }).then(()=>{ this.populateGrid(); });
  }
}

