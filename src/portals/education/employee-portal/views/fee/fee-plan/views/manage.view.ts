import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FeePlan, FeePlanQueryOptions} from "../domains/fee-plan.serializer";
import {FeePlanService} from "../services/fee-plan.service";
import {ViewExtender, NumberCell, CurrencyCell} from "@app-global";
import {FeePlanNameActionCell} from "../grid-cells/fee-plan-grid-cell.component";
import {FeePlanPluginFactory} from "../services/fee-plan.factory";

@Component({
  standalone: false,
  templateUrl: './templates/manage.html'
})
export class FeePlanManageView extends ViewExtender<FeePlan> implements OnInit, OnDestroy {
  //@ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  override coreState: FeePlanQueryOptions = new FeePlanQueryOptions();
    constructor(public override service: FeePlanService, public feePlanFactory: FeePlanPluginFactory,
              public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Plan Name', field: 'name', cellTemplate: FeePlanNameActionCell },
          {headerName: 'Session', field: 'orgSessionName'  },
          {headerName: 'Course', field: 'courseName'  },
          {headerName: 'Course Section', field: 'courseSectionName'  },
          {headerName: 'Study Mode', field: 'studyModeName' },
          {headerName: 'Amount', field: 'totalAmount', class: 'text-right', cellTemplate: CurrencyCell },
          {headerName: 'Tax', field: 'totalTaxAmount', class: 'text-right', cellTemplate: CurrencyCell },
          {headerName: 'Total', field: 'netPayAmount', class: 'text-right', cellTemplate: CurrencyCell }
      ];
  }

  ngOnInit(){ this.populateGrid(); }
  override ngOnDestroy(){ super.ngOnDestroy(); }

    createNew() {
        const popupHeaderOption = {text: `Fee Plan`, desc: `Fee Plan`};
        const inputData: any = { id: null };
        this.feePlanFactory.feePlanCEPopup(inputData, popupHeaderOption).then(()=>{
            this.feePlanFactory.destroy();
            this.populateGrid();
        }, ()=>{ this.feePlanFactory.destroy(); });
    }

    actionCb(fePlan)
    {
        const { id, name } = fePlan;
        const popupHeaderOption = {text: `${name}`, desc: `Fee Plan`};
        const inputData: any = { id: id, data: fePlan };
        this.feePlanFactory.feePlanCEPopup(inputData, popupHeaderOption).then(()=>{
            this.feePlanFactory.destroy();
            this.populateGrid();
        }, ()=>{ this.feePlanFactory.destroy(); });
    }

  //showFeePlaneDetails = (fePlan) => this.router.navigate(['edit', fePlan.id], {relativeTo: this.activatedRoute.parent});
}
