import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE, DynamicComponent, SharedService} from "@app-global";
import {FeePlan} from "../domains/fee-plan.serializer";
import {FeePlanDetailView} from "../views/fee-plan-detail.view";

@Component({
    standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context.name }} </a>
        <!--<a class="btn btn-xs text-xs b-a" (click)="createReminder(context)"><i class="fa fa-fw fa-plus"></i> Reminder</a>-->
        <div class="item-except text-xs h-1x">
            <a class="btn btn-xs text-xs text-primary pr-2" (click)="checkActivity(context)">Details</a>
            <a class="btn btn-xs text-xs _400"
               [ngbPopover]="feeTypeWise" placement="auto" container="body"
               (mouseenter)="p.open()" #p="ngbPopover" (mouseleave)="p.close()">
                <i class="fa fa-pie-chart"></i>
            </a>
            <ng-template #feeTypeWise>
                <div class="w w-auto">
                    <div class="flex pb-2">
                        <h6 class="text-sm mb-0 _600">Fee Head Wise</h6>
                        <small class="text-muted">Breakup details</small>
                    </div>
                    <table class="table small-table text-xs mb-0">
                            <thead>
                            <tr>
                                <th><span class="pl-2">Fee Type</span></th>
                                <th><span class="float-right">Amount</span></th>
                                <th><span class="float-right">Tax</span></th>
                                <th><span class="pr-2 float-right">Total</span></th>
                            </tr>
                            </thead>
                            <tbody>
                            <ng-template ngFor let-feeSchedule [ngForOf]="context.feeTypeWise | sortBy:'asc': 'sortOrder'" let-j="index">
                                <tr>
                                    <td><span class="pl-2">{{ feeSchedule?.feeTypeName }}</span></td>
                                    <td><span class="float-right">{{ feeSchedule?.amount | orgCurrency }}</span></td>
                                    <td><span class="float-right">{{ feeSchedule?.taxAmount | orgCurrency }}</span></td>
                                    <td><span class="pr-2 float-right">{{ feeSchedule?.amount + feeSchedule?.taxAmount | orgCurrency }}</span></td>
                                </tr>
                            </ng-template>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td><b class="pl-2">Total</b></td>
                                <td><b class="float-right">{{ context?.getTotalAmount() | orgCurrency }}</b></td>
                                <td><b class="float-right">{{ context?.getTotalTaxAmount() | orgCurrency }}</b></td>
                                <td><b class="pr-2 float-right">{{ context?.getNetPay() | orgCurrency }}</b></td>
                            </tr>
                            </tfoot>
                        </table>
                </div>
            </ng-template>
            <a class="btn btn-xs text-xs _400"
               [ngbPopover]="monthYearWise" placement="auto" container="body"
               (mouseenter)="q.open()" #q="ngbPopover" (mouseleave)="q.close()">
                <i class="fa fa-calendar"></i>
            </a>
            <ng-template #monthYearWise>
                <div class="w w-auto">
                    <div class="flex pb-2">
                        <h6 class="text-sm mb-0 _600">Fee Schedule Wise</h6>
                        <small class="text-muted">MonthWise Scheduled Fee Details</small>
                    </div>
                    <table class="table small-table text-xs mb-0">
                        <thead>
                        <tr>
                            <th><span class="pl-2">Month</span></th>
                            <th><span class="pl-2">Amount</span></th>
                            <th><span class="pl-2">Tax</span></th>
                            <th><span class="pr-2 float-right">Total Fee</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <ng-template ngFor let-monthYearItem [ngForOf]="context.monthYearWise" let-k="index">
                            <tr>
                                <td><span class="pl-2">{{monthYearItem?.name}}</span></td>
                                <td><span class="pl-2">{{monthYearItem?.totalAmount | orgCurrency}}</span></td>
                                <td><span class="pl-2">{{monthYearItem?.totalTax | orgCurrency}}</span></td>
                                <td><span class="pr-2 float-right">{{monthYearItem?.totalFee | orgCurrency }}</span></td>
                            </tr>
                        </ng-template>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colspan="3"><b class="pl-2">Total</b></td>
                            <td><b class="float-right pr-2">{{ context?.getSessionTotal() | orgCurrency }}</b></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </ng-template>
        </div>
    </div>`
})
export class FeePlanNameActionCell extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute, public sharedService: SharedService) {
        super();
    }

    checkActivity(row: FeePlan) {
        const {id, name} = row;
        const inputData: any = { id: id };

        const success = (resp)=> { this.sharedService.destroy(); };
        const failure = (resp)=> { this.sharedService.destroy(); };
        const popupOptions = {
            header: {text: `Activity for ${name}`, desc: `Fee Plan Summary`},
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        return this.sharedService.showCustomPopup(FeePlanDetailView, popupOptions, inputData).then(success, failure);
    }
}