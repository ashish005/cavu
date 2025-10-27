import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {PayoutPlanLookupService} from "../services/api.resolver";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, ViewExtender} from "@app-global";
import {VehiclePayoutPlanService} from "../services/vehicle-payout-plan.service";
import {VehiclePayoutPlan, VehiclePayoutPlanQueryOptions} from "../domains/vehicle-payout-plan.serializer";
import {VehiclePayoutPlanCeComponent} from "../components/vehicle-plan-ce.component";

@Component({
  templateUrl: './templates/manage.html',
  standalone: false
})
export class VehiclePlanManageView extends ViewExtender<VehiclePayoutPlan> implements OnInit, OnDestroy {
  override coreState: VehiclePayoutPlanQueryOptions = new VehiclePayoutPlanQueryOptions();
  constructor(public apiResolver: PayoutPlanLookupService,
              public override activatedRoute: ActivatedRoute, public override service: VehiclePayoutPlanService, private sharedService: SharedService) {
    super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Plan Name', field: 'name' },
          {headerName: 'Detail', field: ''  }
      ];
  }

  ngOnInit(){ this.populateGrid(); }
  override ngOnDestroy(){ super.ngOnDestroy(); }

    createNew() {
        const planHeads = this.apiResolver.masterType.vehiclePayoutHeads;
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

        this.showPopup(row.id, row,{ text: `Vehicle Payout Plan - ${row.name}`, desc: '' });
    }

    showPopup(id, data, header){
        const popup = { header: header, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };

        const inputData: any = { id: id, data: data };
        let modal$ = this.sharedService.showCustomPopup(VehiclePayoutPlanCeComponent, popup, inputData);
        modal$.then((resp)=>{
            this.sharedService.destroy();
            this.populateGrid();
        }, (err)=>{
            this.sharedService.destroy();
        });
    }
}
