import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE, SharedService, DynamicComponent} from "@app-global";
import {VendorBranch} from "../domains/vendor-branch.serializer";

@Component({
  standalone: false,
    template: `<div>
        <a class="text-sm _500">{{ context?.name }}</a> <a *ngIf="context.code"> /{{ context.code}}</a>
        <!--<a class="text-primary text-xs _500 float-right text-right" (click)="manageProducts()">Manage Products/ Services</a>-->
        <div class="item-except text-xs h-1x">
            <!--<a class="text-primary" (click)="showPayments()">Payments</a>-->
            <a class="btn btn-xs text-xs btn-outline" (click)="sendCommunication(context)"><i class="fa fa-inbox"></i></a>
            <a class="btn btn-xs text-xs btn-outline mx-1" (click)="showLedger()">My Ledger</a>
            <a class="text-info" (click)="showDetails(context)">Details</a>
        </div>
    </div>`
})
export class VendorBranchNameActionCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute,
                public sharedService: SharedService){ super(); }

    showDetails(row: VendorBranch){ this.router.navigate(['../', row.accountId], {relativeTo: this.activatedRoute.parent}); }

    manageProducts(){
        /*const inputData: any = {
            id: this.context.id,
            vendorId: this.context.vendorId,
            accountId: this.context.accountId,
            data: this.context.vendor
        };
        const popup = {
            header: { text: `Manage Products/ Services`, desc: 'Manage Products/ Services' },
            aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75
        };

        const success = (resp: any)=>
        {
            this.sharedService.destroy();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(ManageProductView, popup, inputData);
        modal$.then(success, failure);*/
    }

    /*showPayments(){
        const inputData: any = {
            id: this.context.id,
            vendorId: this.context.vendorId,
            accountId: this.context.accountId,
            actionType: ACTION_ENUM.SHOW
        };

        const popup = {
            header: { text: `${this.context.name}`, desc: 'Payment Details' },
            aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75, actionType: ACTION_ENUM.SHOW
        };
        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (e) => { this.pluginFactory.destroy(); };

        this.pluginFactory.showLedgerInfoReportPopup(inputData, popup).then(success, failure);
    }

    showReport(){
        const inputData: any = {
            // branchId: this.context.id,
            // vendorId: this.context.vendorId,
            accountId: this.context.accountId,
            actionType: ACTION_ENUM.SHOW
        };
        const popup = {
            header: { text: `${this.context.name}`, desc: 'Ledger Details' },
            aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75, actionType: ACTION_ENUM.SHOW
        };
        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (e) => { this.pluginFactory.destroy(); };

        this.pluginFactory.showVoucherReportPopup(inputData, popup).then(success, failure);
    }*/

    showLedger(){
        // const inputData: any = {
        //     accountId: this.context.accountId,
        //     actionType: ACTION_ENUM.SHOW
        // };
        // const popup = {
        //     header: { text: `${this.context.name}`, desc: 'Ledger Details' },
        //     aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75, actionType: ACTION_ENUM.SHOW
        // };
        // const success = (resp: any) => { this.pluginFactory.destroy(); };
        // const failure = (e) => { this.pluginFactory.destroy(); };
        //
        // this.pluginFactory.showLedgerWiseGridReportPopup(inputData, popup).then(success, failure);
    }

    sendCommunication(data: VendorBranch) {
        // const { notificationUser, name } = data;
        // const inputData: any = {
        //     data: notificationUser,
        //     actionType: ACTION_ENUM.SHOW
        // };
        // const popupHeader = {text: `Communication info for ${name}`, desc: ``};
        //
        // const success = (resp: any) => { this.pluginFactory.destroy(); };
        // const failure = (e) => { this.pluginFactory.destroy(); };
        //
        // this.pluginFactory.showUserNotificationTemplateViewPopup(inputData, popupHeader).then(success, failure);
    }
}

@Component({
  standalone: false,
    template: `<div>
        <span>{{ context.vendor?.registrationNo || '--' }}</span>
        <div class="item-except h-1x">
            {{ context.vendor?.registrationDate | dateFormat }}
        </div>
    </div>`
})
export class VendorBranchRegistrationCell extends DynamicComponent{
    constructor(){ super(); }
}

/*
@Component({
    template: `<div class="d-block text-center text-xs _500">
        <a class="text-primary" (click)="manageServices()">Products/ Services ({{ context.vendor.productCount }})</a>
        <div class="item-except h-1x">
            <a class="text-primary px-2 b-r" (click)="manageExecutive()">Executive ({{ context.executiveCount }})</a>
            <a class="text-primary px-2" (click)="manageBranch()">Branch</a>
        </div>
    </div>`
})
export class VendorBranchActionCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute,
                public sharedService: SharedService){ super(); }

    manageExecutive(){ this.router.navigate(['../', this.context.id, 'executive'], { relativeTo: this.activatedRoute.parent}); }
    manageServices(){ this.router.navigate(['../', this.context.id, 'services'], { relativeTo: this.activatedRoute.parent}); }
    manageBranch(){ this.router.navigate(['../', this.context.id, 'details'], { relativeTo: this.activatedRoute.parent}); }
}*/
