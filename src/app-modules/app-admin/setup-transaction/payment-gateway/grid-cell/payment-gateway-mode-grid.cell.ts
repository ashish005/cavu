import { DynamicComponent } from "@app-global";
import {Component} from "@angular/core";
import {PaymentGatewayLookupAPIResolver} from "../services/api.resolver";
import {PaymentGatewayByMode} from "../domains/payment-gateway-by-mode.serializer";
import {PaymentGateway} from "../domains/payment-gateway.serializer";

@Component({
  standalone: false,
    template: `<div>
        <a class="item-title _500">{{context.gatewayName}}</a>
        <div class="item-except text-xs" *ngIf="context.isReconciliationRequired">
            <small>{{context.recoFrequencyTypeName}}</small><small>{{context.recoNextDate | dateFormat }}</small>
            <a class="badge badge-pill _400" (click)="showScheduler(context)" [class]="(context.orgTaskScheduleId)? 'text-success': 'text-warning'">
                <i class="fa fa-calendar"></i> Reconciliation
            </a>
        </div>
    </div>`
})
export class PaymentModeGatewayCell extends DynamicComponent {
    constructor(public apiResolver: PaymentGatewayLookupAPIResolver) { super(); }
    showScheduler(row: PaymentGateway){
        const { orgTaskScheduleId, orgTaskId, orgTaskName } = row;
        const inputData: any = {
            id: orgTaskScheduleId, //Schedular ID
            taskId: orgTaskId,
            addManually: true, //Service will not add it automatically
        };
        const popupHeaderOption = { text: `${orgTaskName} Scheduler`, desc: `Schedule tasks` };
        this.apiResolver.showSchedulerPopup(row.id, inputData, popupHeaderOption, (orgTaskScheduleId)=>{
            this.context.orgTaskScheduleId = orgTaskScheduleId;
        });
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="btn btn-xs text-xs text-primary float-left" (click)="serviceCharges(context)">Service Charges</a>
    </div>`
})
export class PaymentModeServiceChargesCell extends DynamicComponent {
    constructor(public apiResolver: PaymentGatewayLookupAPIResolver) { super(); }
    serviceCharges(row: PaymentGatewayByMode) {
        let { id } = row;
        const inputData: any = {
            mapperId: id,
            modeMapper: row,
            data: row
        };
        this.apiResolver.showServiceChargeCE(inputData, {text: `Charges for ${row?.systemTypeMasterType}`, desc: ``});
    }
}
