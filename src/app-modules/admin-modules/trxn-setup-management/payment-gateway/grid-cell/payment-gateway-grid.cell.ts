import { DynamicComponent } from "@app-global";
import {Component} from "@angular/core";
import {PaymentGateway} from "../domains/payment-gateway.serializer";
import {PaymentGatewayLookupAPIResolver} from "../services/api.resolver";
import {ModeGatewayMapperLookup} from "../domains/lookup.serializer";

@Component({
  standalone: false,
    template: `<div>
        <a class="item-title _500">{{context.name}}</a>
        <div class="item-except text-sm" *ngIf="context.isReconciliationRequired">
            <small>{{context.recoFrequencyTypeName}}</small><a class="item-title _500">{{ context.recoNextDate | dateFormat }}</a>
            <a class="badge badge-pill _400" (click)="showScheduler(context)" [class]="(context.orgTaskScheduleId)? 'text-success': 'text-warning'">
                <i class="fa fa-calendar"></i> Reconciliation
            </a>
        </div>
    </div>`
})
export class PaymentGatewayCell extends DynamicComponent {
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
        <ul class="list-group">
            <ng-template ngFor let-mode [ngForOf]="context?.activeGatewayMapper" let-i="index">
                <li class="list-group-item p-1">
                    <a class="btn btn-xs text-xs text-primary float-left" (click)="serviceCharges(context, mode)">Service Charges</a>
                    <div class="clear d-block">
                        <a class="_500">{{ mode?.modeName }}</a>
                        <div class="float-right text-xs d-block">
                            <div class="d-inline-block px-2 b-r"><span [class]="(mode.isReceiptAllowed)? 'text-success' : 'text-danger'">Receipt</span></div>
                            <div class="d-inline-block px-2"><span [class]="(mode.isPaymentAllowed)? 'text-success' : 'text-danger'">Payment</span></div>
                        </div>
                    </div>
                </li>
            </ng-template>
        </ul>
    </div>`
})
export class PaymentModeCell extends DynamicComponent {
    constructor(public apiResolver: PaymentGatewayLookupAPIResolver) { super(); }
    serviceCharges(row: PaymentGateway, modeMapper: ModeGatewayMapperLookup) {
        let { id, name } = row;
        const inputData: any = {
            mapperId: modeMapper.id,
            modeMapper: modeMapper,
            data: row
        };
        this.apiResolver.showServiceChargeCE(inputData, {text: `Charges for ${name}`, desc: ``});
    }
}

@Component({ standalone: false, template: `<span class="text-sm d-block">{{context[col?.field]}}</span>` })
export class PaymentGatewayOptionsCell extends DynamicComponent { constructor() { super(); } }

@Component({
  standalone: false,
    template: `<div>
        <a class="item-title _500"><i class="fa" [class]="(context.isPOS)? 'fa-check text-success' : 'fa-close text-danger'"></i></a>
        <div class="item-except text-xs"><span *ngIf="context.isPOS">{{context.posNo}}</span></div>
    </div>`
})
export class PaymentGatewayPOSOptionsCell extends DynamicComponent { constructor() { super(); } }

@Component({
  standalone: false,
    template: `<div>{{context.providerAccountName || '--'}}<div class="h-1x text-xs">{{context.providerAccountGroupName || '--'}}</div></div>`
})
export class PaymentProviderGatewayAccountCell extends DynamicComponent { constructor() { super(); } }

@Component({
  standalone: false,
    template: `<div>{{context.realizationAccountName || '--'}}<div class="h-1x text-xs">{{ context.realizationAccountGroupName || '--'}}</div></div>`
})
export class PaymentRealizationGatewayAccountCell extends DynamicComponent { constructor() { super(); } }
