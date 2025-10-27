import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {PayoutPlanLookupService} from "../services/api.resolver";
import {ViewExtender, SharedService, ASIDE_SIZE, ASIDE_CLASS} from "@app-global";
import {DriverPayoutPlan, DriverPayoutPlanQueryOptions} from "../domains/driver-payout-plan.serializer";
import {DriverPayoutPlanService} from "../services/driver-payout-plan.service";
import {DriverPayoutPlanCeComponent} from "../components/driver-plan-ce.component";

@Component({
  templateUrl: './templates/manage.html',
  standalone: false
})
export class DriverPlanManageView extends ViewExtender<DriverPayoutPlan> implements OnInit, OnDestroy {
  override coreState: DriverPayoutPlanQueryOptions = new DriverPayoutPlanQueryOptions();
  constructor(public apiResolver: PayoutPlanLookupService,
              public override activatedRoute: ActivatedRoute, public override service: DriverPayoutPlanService, public sharedService: SharedService) {
    super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Plan Name', field: 'name' },
          {headerName: 'Frequency', field: 'frequencyName'  },
          {headerName: 'Detail', field: ''  }
      ];
  }

  ngOnInit(){ this.populateGrid(); }
  override ngOnDestroy(){ super.ngOnDestroy(); }

  createNew() {
      const planHeads = this.apiResolver.masterType.driverPayoutHeads;
      const data = {
          payoutFrequency: 3,
          planHeads: (planHeads || []).map(r => {
              return {
                  headId: r.id,
                  headName: r.name,
                  amount: 1000,
                  basedOn: 1,
                  frequency: 3,
                  isActive: true
              };
          })
      };
      this.showPopup(null, data,{ text: `New Plan`, desc: '' });
  }

  actionCb(row){

      this.showPopup(row.id, row,{ text: `Driver Payout Plan - ${row.name}`, desc: '' });
  }

  showPopup(id, data, header){
      const popup = { header: header, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };

      const inputData: any = { id: id, data: data };
      let modal$ = this.sharedService.showCustomPopup(DriverPayoutPlanCeComponent, popup, inputData);
      modal$.then((resp)=>{
          this.sharedService.destroy();
          this.populateGrid();
      }, (err)=>{
          this.sharedService.destroy();
      });
  }
}
