import {EventEmitter, Injectable, Injector} from "@angular/core";
import {map, tap, catchError} from "rxjs";
import { OrgResourceService } from "@app-global";
import {InvoiceNotification, InvoiceNotificationSerializer} from "../domains/invoice-notification.serializer";
import {Recipient, RecipientSerializer} from "../domains/recipient";

@Injectable()
export class InvoiceNotificationService extends OrgResourceService<InvoiceNotification>{
    constructor(public override injector: Injector) {
      super(injector, 'invoiceNotification', new InvoiceNotificationSerializer());
    }

    //getCurrentUser() { return this.coreService.currentUser; }

    notificationSend(data: any)
    {
        //const { id, orgBranchId } = this.getCurrentUser();
        //data.userTypeId = this.coreService.currentUser.userTypeId;
        //data.senderUserId = id;
        // data.orgUnitId = orgUnitId;
        // data.orgBranchId = orgBranchId;
        return this.httpClient.post(super.viewUrl + `/send`, data, super.requestHeaders)
            .pipe(
                map((resp: any) => resp),
                tap(
                    (error) => {
                        super.handleError(error, () => this.notificationSend(data))
                    }
                )
            );
    }
}

/*@Injectable()
export class NotificationTemplateService extends CoreSectorResourceService<NotificationTemplate> {
    public syncTemplate: EventEmitter<any> = new EventEmitter<any>();
    constructor(public injector: Injector) { super(injector, `template`, new NotificationTemplateSerializer());}

    createTemplateScheduler(data: any, templateId: any) {
        const url: string = this.baseSectorAPIUrl + `template/scheduler/${templateId}`;
        return this.httpClient.post(url, data, this.requestHeaders)
            .pipe(
                tap(
                    (error) => {
                        this.handleError(error, () => this.createTemplateScheduler(data, templateId));
                    }
                )
            );
    }
}*/

@Injectable()
export class NotificationRecipientService extends OrgResourceService<Recipient> {
    constructor(public override injector: Injector) { super(injector, `notification/recipient`, new RecipientSerializer()); }

    getRecipients(search){
        return this.httpClient
            .get(`${super.baseSectorAPIUrl}/lookupSearch/contact/user/${search}`, super.requestHeaders)
            .pipe(map(resp => resp), catchError(r => r));
    }
}
