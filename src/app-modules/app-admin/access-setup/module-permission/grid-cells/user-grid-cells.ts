import {DynamicComponent} from "@app-global";
import {Component} from "@angular/core";
import {UserManagementAPIResolver} from "../services/api.resolver";
import {User} from "../domains/user.model";

@Component({
    template: `<div>
    <a class="text-xs _500"> {{ context.name }}</a>
    <div class="item-except text-xs">
        <a class="btn btn-xs b-theme text-xs px-1 mx-1 text-primary" (click)="showMyPermission(context)"> My Permission </a>
        <a class="btn btn-xs b-theme text-xs px-1 mx-1 text-primary" (click)="sendCommunication(context)">Send Notifications </a>
    </div>
</div>`
})
export class UserNameCell extends DynamicComponent {
    constructor(private apiResolver: UserManagementAPIResolver) { super(); }

    sendCommunication(row: User) {
        /*const { notificationUser, tradeName } = data;
        const inputData: any = {
            data: notificationUser,
            actionType: ACTION_ENUM.SHOW
        };
        const popupHeader = {text: `Communication info for ${tradeName}`, desc: ``};

        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (e) => { this.pluginFactory.destroy(); };

        this.pluginFactory.showUserNotificationTemplateViewPopup(inputData, popupHeader).then(success, failure);*/
    }

    /*showLedger(){
        const inputData: any = {
            accountId: this.context.accountId,
            viewType: 'info',
            actionType: ACTION_ENUM.SHOW
        };
        const popup = {
            header: { text: `${this.context.name}`, desc: 'Ledger Details' },
            aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75, actionType: ACTION_ENUM.SHOW
        };
        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (e) => { this.pluginFactory.destroy(); };

        this.pluginFactory.showLedgerWiseGridReportPopup(inputData, popup).then(success, failure);
    }*/

    showMyPermission(row: User) {
        const {id, name} = row;
        const inputData: any = {
            id: id,
            showPermissionUpdateButton: false,
            showNew: false,
            singleRole: false,
            module: 'Permission',
            data: row
        };
        this.apiResolver.showMyPermission(inputData, {text: `${name}`, desc: 'Manage Permission'});
    }
}

@Component({
    template: `<div>
        <a class="text-xs _500"></a>
        <div class="d-block text-xs">
            <div class="clearfix px-1"><i class="fa fa-envelope"></i> Email {{context.email }}</div>
            <div class="clearfix px-1"><i class="fa fa-phone"></i> {{context.phoneNumber }}</div>
        </div>
        <!--<div class="item-except text-xs h-1x">
            <span class="text-muted"> {{context.client?.taxRegistrationNo }}</span>
        </div>-->
    </div>`
})
export class UserContactCell extends DynamicComponent {
    constructor() { super(); }
}

@Component({
    template: `<div>
        <span class="text-xs">{{context.userName}}</span>
        <div class="text-xs">
            <small class="pr-1">{{context.userTypeName}}</small>
        </div>
    </div>`
})
export class UserLoginInfoCell extends DynamicComponent {
    constructor() { super(); }
}
