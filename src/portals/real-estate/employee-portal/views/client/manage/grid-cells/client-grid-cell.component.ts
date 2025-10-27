import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Client} from "../domains/client.serializer";
import {DynamicComponent} from "@app-global";

@Component({
  standalone: false,
    template: `<div>
        <div *ngIf="!context?.accountId" [class.text-danger]="!context?.accountId">Account setup issue</div>
        <a class="text-sm _500" (click)="showDetails(context)"> {{ context.isRegistered ? context.companyName: context.name }} </a>
        <div class="item-except text-xs h-1x">
            <a class="btn btn-xs text-xs" (click)="sendCommunication(context)"><i class="fa fa-inbox"></i></a>
            <a class="btn btn-xs text-xs px-2" (click)="showLedger()">My Ledger</a>
            <a class="btn btn-xs text-xs" (click)="showDetails(context)"> Details </a>
         <span class="text-info mr-2">{{context.isRegistered ? 'Registered': ''}}</span>
         <span class="text-muted b-a px-2" *ngIf="context.isRegistered"> <small class="pr-2">Primary contact</small>{{context.name || '--'}}</span>
        </div>
    </div>`
})
export class ClientNameActionCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
    showDetails(row: Client){ this.router.navigate(['../', row.accountId], {relativeTo: this.activatedRoute.parent.parent}); }

    sendCommunication(data: Client) {
        /*const { notificationUser, name } = data;
        const inputData: any = {
            data: notificationUser,
            actionType: ACTION_ENUM.SHOW
        };
        const popupHeader = {text: `Communication info for ${name}`, desc: ``};

        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (e) => { this.pluginFactory.destroy(); };

        this.pluginFactory.showUserNotificationTemplateViewPopup(inputData, popupHeader).then(success, failure);*/
    }

    showLedger(){
        /*const { accountId } = this.context;
        const inputData: any = {
            accountId: accountId,
            viewType: 'info',
            actionType: ACTION_ENUM.SHOW
        };

        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (e) => { this.pluginFactory.destroy(); };

        const popupHeadderOptions = { text: `${this.context.name}`, desc: 'Ledger Details' };
        this.pluginFactory.showLedgerWiseGridReportPopup(inputData, popupHeadderOptions).then(success, failure);*/
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs text-muted"><i class="fa fa-envelope pr-2"></i>{{ context?.email }}</a>
        <div class="item-except text-xs text-muted h-1x"><i class="fa fa-phone pr-2"></i>{{context?.phone}}</div>
    </div>`
})
export class ClientContactCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-primary text-xs _500">{{ context.registrationNo }}</a>
        <div class="item-except text-xs text-muted h-1x">{{context.registrationDate | dateFormat}} </div>
    </div>`
})
export class ClientRegInfoCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}

@Component({
  standalone: false,
    template: `<a class="text-primary text-xs _500" (click)="showDetails(context)">{{ context?.name }}</a>`
})
export class ClientProjectNameActionCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
    showDetails(row){
        this.router.navigate(['../../project', row?.id], {relativeTo: this.activatedRoute.parent});
    }
}

@Component({
  standalone: false,
    template: `<a class="text-primary text-xs _500">{{ context?.title }} {{ context?.fName }} {{ context?.lName }}</a>`
})
export class ClientContactNameActionCell extends DynamicComponent{constructor(public activatedRoute: ActivatedRoute){ super(); }}

@Component({
  standalone: false,
    template: `<a class="text-primary text-xs _500">{{ context?.payMode?.mode }} {{ context?.payMode?.referenceNo }}</a>`
})
export class ClientPaymentModeCell extends DynamicComponent{constructor(){ super(); }}

@Component({
  standalone: false,
    template: `<i *ngIf="context?.isPrimary" class="fa fa-check text-success"></i>`
})
export class ClientContactPrimaryCell extends DynamicComponent{constructor(){ super(); }}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-primary text-xs _500">{{ context?.dueAmount }}</a>
        <div class="item-except text-xs text-muted h-1x">{{context?.dueDaate}}</div>
    </div>`
})
export class ClientDueInfoCell extends DynamicComponent{constructor(){ super(); }}
