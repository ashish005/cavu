import {Component, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {StudentSummary} from "../domains/student.serializer";
import {StudentSummaryService} from "../services/student.service";
import {BatchFeeCeComponent} from "../components/batch-fee-ce.component";
import {StudentBatchDetailsView} from "../components/student-batch-details.view";
import {ASIDE_CLASS, ASIDE_SIZE, DynamicComponent, SharedService} from "@app-global";

@Component({
    standalone: false,
    template: `<div>
        <a class="px-1" data-toggle="tooltip" data-placement="top" title="{{ context.email }}"><i class="fa fa-envelope"></i></a>
        <a class="px-1" data-toggle="tooltip" data-placement="top" title="{{ context.phone }}"><i class="fa fa-mobile"></i></a>
        <a class="text-xs _500" (click)="routeToBatch(context)"> {{ context.name }} </a> 
    </div>`
})
export class StudentNameActionCell extends DynamicComponent {
    constructor(public router: Router, public activatedRoute: ActivatedRoute) {
        super();
    }

    routeToBatch(row: any) {
        this.router.navigate(['../edit', row.id, 'batch'], {relativeTo: this.activatedRoute.parent});
    }
}

@Component({
    standalone: false,
    template: `
<div class="btn-group">
    <a class="btn btn-xs b-a item-title text-xs" (click)="showLedger(context)"> My Account </a>
    <a class="btn btn-xs b-a item-title text-xs mx-2" (click)="sendCommunication(context)"> Notifications </a>
</div>`
})
export class StudentActionCell extends DynamicComponent {
    constructor(public router: Router, public activatedRoute: ActivatedRoute,
                public summaryService: StudentSummaryService) {
        super();
    }

    sendCommunication(data: StudentSummary) {
        const { id, userId, email} = data;
        // const { notificationUser, name } = data;
        // const inputData: any = {
        //     data: notificationUser,
        //     actionType: ACTION_ENUM.SHOW
        // };
        // const popupHeader = {text: `Communication info for ${name}`, desc: ``};
        //
        // const success = (resp: any) => { this.pluginFactory.destroy(); };
        // const failure = (e) => { this.pluginFactory.destroy(); };
        /*const inputData: any = {
            data: new NotificationUser({
                //orgUserId: id,
                //userTypeId: userTypeId,
                userMasterType: 'student',
                userId: userId
            })
        };
        this.factory.showUserNotificationTemplateViewPopup(inputData, {text: `Communication info for ${email}`, desc: ``});
        */
    }

    showLedger(row: StudentSummary){
        const  { name, accountId } = row;
        const inputData: any = {
            accountId: accountId
        };

        // const success = (resp: any) => { this.factory.destroy(); };
        // const failure = (e) => { this.factory.destroy(); };
        // this.factory.showLedgerWiseGridReportPopup(inputData, { text: `${name}`, desc: 'Ledger Details' })
        //     .then(success, failure);
    }
}

@Component({
    standalone: false,
    template: `<div>
            <a class="btn btn-xs text-xs _400" [ngbPopover]="challanBreakup" placement="auto" container="body" (mouseenter)="p.open()" #p="ngbPopover" (mouseleave)="p.close()"><i class="fa fa-pie-chart"></i>
            </a>
            <ng-template #challanBreakup>
                <div class="w w-auto">
                    <div class="flex pb-2">
                        <h6 class="text-sm mb-0 _600">Fee Head Wise</h6>
                        <small class="text-muted">Breakup details</small>
                    </div>
                    <table class="table small-table text-xs mb-0">
                            <thead>
                            <tr>
                                <th><span>Date</span></th>
                                <th><span>Total</span></th>
                                <th><span class="float-right">Due</span></th>
                                <th><span class="float-right">Advance</span></th>
                                <th><span class="float-right">Balance</span></th>
                                <th><span class="float-right">Paid</span></th>
                            </tr>
                            </thead>
                            <tbody>
                            <ng-template ngFor let-row [ngForOf]="context.challanBreakups" let-j="index">
                                <tr>
                                    <td><span>{{ row.name }}</span></td>
                                    <td><span>{{ row.totalFee | orgCurrency }}</span></td>
                                    <td><span class="pr-2 float-right">{{ row.dueFee | orgCurrency }}</span></td>
                                    <td><span class="pr-2 float-right">{{ row.paid | orgCurrency }}</span></td>
                                    <td><span class="float-right">{{ row.balance | orgCurrency }}</span></td>
                                    <td><span class="float-right">{{ row.advance | orgCurrency }}</span></td>
                                </tr>
                            </ng-template>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colspan="2"><b class="float-right">Total</b></td>
                                <td><b class="float-right">{{ context.dueFee | orgCurrency }}</b></td>
                                <td><b class="pr-2 float-right">{{ context.paid | orgCurrency }}</b></td>
                                <td><b class="float-right">{{ context.balance | orgCurrency }}</b></td>
                                <td><b class="float-right">{{ context.advance | orgCurrency }}</b></td>
                            </tr>
                            </tfoot>
                        </table>
                </div>
            </ng-template>
    </div>`
})
export class ChallanFeeBreakupActionCell extends DynamicComponent {
    constructor() { super(); }
}

@Component({
    standalone: false,
    template: `
<div class="btn-group">
    <a *ngIf="context.isFeeSynced" class="btn btn-xs text-xs b-a item-title text-xs" (click)="newStudentBatchPopup(context)"><i class="fa fa-fw fa-plus"></i> Batch </a>
    <a *ngIf="context.isFeeSynced" class="btn btn-xs text-xs text-primary px-1" (click)="showStudentBatchFeePopup(context)">Batches</a>
    <a *ngIf="!context.isFeeSynced" class="btn btn-xs text-xs text-danger" (click)="showStudentBatchFeePopup(context)"> Sync Fee</a>
</div>
`
})
export class SyncStudentFeeActionCell extends DynamicComponent {
    isLoading: boolean = false;
    constructor(public summaryService: StudentSummaryService, public sharedService: SharedService) {
        super();
    }

    newStudentBatchPopup(row: any) {
        const { id, name } = row;
        const inputData: any = { id: null, studentId: id };
        this.createEditStudentBatchPopup(inputData, {text: `Batches info for ${name}`, desc: ``}, ()=>{
            this.summaryService.refresh.emit(true);
        });
    }

    createEditStudentBatchPopup(data: any, header: any, cb)
    {
        const popupOptions = {
            header: header || { text: `Fee Type`, desc: `Fee Type` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        data = data || { studentId: null };

        const success = (resp: any) => { this.sharedService.destroy(); cb(); };
        const failure = (e) => { this.sharedService.destroy(); cb(); };
        return this.sharedService.showCustomPopup(BatchFeeCeComponent, popupOptions, data).then(success, failure);
    }

    showStudentBatchFeePopup(row: StudentSummary){
        const { id, name } = row;
        const inputData: any = {
            id: null,
            studentId: id,
            viewType: 'batches'
        };
        const popupOptions = {
            header: {text: `Batches info for ${name}`, desc: ``},
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any) => { this.sharedService.destroy(); };
        const failure = (e) => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(StudentBatchDetailsView, popupOptions, inputData).then(success, failure);
    }
}