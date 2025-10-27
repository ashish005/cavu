import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DynamicComponent} from "@app-global";
import {OrgEmployee} from "../domains/org-employee.serializer";
import {OrgUserAPIResolver} from "../services";

@Component({
  standalone: false,
    template: `<div>
        <a class="px-1" data-toggle="tooltip" data-placement="top" title="{{ context.email }}"><i class="fa fa-envelope"></i></a>
        <a class="px-1" data-toggle="tooltip" data-placement="top" title="{{ context.phone }}"><i class="fa fa-mobile"></i></a>
        <a class="text-xs _500" (click)="routeToBatch(context)"> {{ context.name }} </a>
    </div>`
})
export class EmployeeNameActionCell extends DynamicComponent {
    constructor(public router: Router, public activatedRoute: ActivatedRoute) {
        super();
    }

    routeToBatch(row: any) {
        this.router.navigate(['../edit', row.id, 'batch'], {relativeTo: this.activatedRoute.parent});
    }
}

@Component({
  standalone: false,
    template: `<!--<a class="btn btn-xs b-a item-title text-xs" (click)="remindToEmployee()"> Reminders </a>-->
        <a class="btn btn-xs b-a item-title text-xs" (click)="sendCommunication(context)"> Send Notifications </a>
        <!--<a class="btn btn-xs b-a item-title text-xs" (click)="showMyTask()"> ToDay's Task </a>
        <a class="btn btn-xs b-a item-title text-xs" (click)="showMyActivities()"> Activities </a>-->
        <a class="btn btn-xs b-a item-title text-xs" (click)="showLedger(context)"> My Account </a>`
})
export class EmployeeActionCell extends DynamicComponent{
    constructor(public activatedRoute: ActivatedRoute, public apiResolver: OrgUserAPIResolver){ super(); }
    sendCommunication(data: OrgEmployee) {
        /*const { notificationUser, name } = data;
        const inputData: any = {
            data: notificationUser,
            actionType: ACTION_ENUM.SHOW
        };
        const popupHeader = {text: `Communication info for ${name}`, desc: ``};
        this.apiResolver.showUserNotificationTemplateViewPopup(inputData, popupHeader);*/
    }

    remindToEmployee(){}
    showMyTask(){}
    showMyActivities(){}

    showLedger(row: OrgEmployee){
        const  { name, accountId } = row;
        const inputData: any = {
            accountId: accountId
        };

        /*const success = (resp: any) => { this.factory.destroy(); };
        const failure = (e) => { this.factory.destroy(); };
        this.factory.showLedgerWiseGridReportPopup(inputData, { text: `${name}`, desc: 'Ledger Details' })
            .then(success, failure);*/
    }
}
