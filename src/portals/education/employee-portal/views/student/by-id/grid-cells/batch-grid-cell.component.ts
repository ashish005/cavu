import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DynamicComponent} from "@app-global";

@Component({
    standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context.orgBatch }} </a>
        <div class="item-except text-xs">
            {{context.orgSession}}
        </div>
    </div>`
})
export class StudentBatchNameGridCellComponent extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute) {
        super();
    }
}

@Component({
    standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context.course }} </a>
        <div class="item-except text-xs">
            {{ context.courseSection }}
        </div>
    </div>`
})
export class StudentBatchCourseGridCellComponent extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute) {
        super();
    }
}

@Component({
    standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context.feePlan }} </a>
        <!--<div class="item-except text-xs h-1x">
            <a class="btn btn-xs text-xs _400"
               [ngbPopover]="feeTypeWise" placement="auto" container="body"
               (mouseenter)="p.open()" #p="ngbPopover" (mouseleave)="p.close()">
                <i class="fa fa-pie-chart"></i>
            </a>
            <ng-template #feeTypeWise>
                <div class="w w-xxl">
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
                            <ng-template ngFor let-feeSchedule [ngForOf]="context.feePlanInfo?.feeTypeWise | sortBy:'asc': 'sortOrder'" let-j="index">
                                <tr>
                                    <td><span class="pl-2">{{ feeSchedule?.feeTypeName }}</span></td>
                                    <td><span class="float-right">{{ feeSchedule?.amount | orgCurrency }}</span></td>
                                    <td><span class="float-right">{{ feeSchedule?.taxAmount | orgCurrency }}</span></td>
                                    <td><span class="pr-2 float-right">{{ feeSchedule?.amount + feeSchedule?.taxAmount | orgCurrency }}</span></td>
                                </tr>
                            </ng-template>
                            </tbody>
                            <tfoot>
                            &lt;!&ndash;<tr>
                                <td><b class="pl-2">Total</b></td>
                                <td><b class="float-right">{{ context?.getTotalAmount() | orgCurrency }}</b></td>
                                <td><b class="float-right">{{ context?.getTotalTaxAmount() | orgCurrency }}</b></td>
                                <td><b class="pr-2 float-right">{{ context?.getNetPay() | orgCurrency }}</b></td>
                            </tr>&ndash;&gt;
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
                <div class="w w-xxl">
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
                        <ng-template ngFor let-monthYearItem [ngForOf]="context.feePlanInfo?.monthYearWise" let-k="index">
                            <tr>
                                <td><span class="pl-2">{{monthYearItem?.name}}</span></td>
                                <td><span class="pl-2">{{monthYearItem?.totalAmount | orgCurrency}}</span></td>
                                <td><span class="pl-2">{{monthYearItem?.totalTax | orgCurrency}}</span></td>
                                <td><span class="pr-2 float-right">{{monthYearItem?.totalFee | orgCurrency }}</span></td>
                            </tr>
                        </ng-template>
                        </tbody>
                        &lt;!&ndash;<tfoot>
                        <tr>
                            <td colspan="3"><b class="pl-2">Total</b></td>
                            <td><b class="float-right pr-2">{{ context?.getSessionTotal() | orgCurrency }}</b></td>
                        </tr>
                        </tfoot>&ndash;&gt;
                    </table>
                </div>
            </ng-template>
        </div>-->
    </div>`
})
export class StudentBatchFeePlanGridCellComponent extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute) {
        super();
    }
}

@Component({
    standalone: false,
    template: `<div>
        <a class="text-xs _500"> {{ context.orgClass }} </a>
        <div class="item-except text-xs">
            {{context.classSection}}
        </div>
    </div>`
})
export class StudentBatchClassGridCellComponent extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute) {
        super();
    }
}