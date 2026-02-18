import  { OrgResourceService } from "@app-global";
import { map, tap } from "rxjs/operators";
import {EventEmitter, Injectable, Injector} from "@angular/core";
import {OrgNotification, OrgNotificationSerializer} from "../domains/notification.serializer";
import {NotificationTemplate, NotificationTemplateSerializer} from "../domains/notification-template.serializer";

@Injectable()
export class NotificationService extends OrgResourceService<OrgNotification>{
    constructor(public override injector: Injector) {
        super(injector, 'notification', new OrgNotificationSerializer());
    }
    createNotificationScheduler(data: any, notificationId: any) {
        const url: string = this.viewUrl + `/scheduler/${notificationId}`;
        return this.httpClient.post(url, data, this.requestHeaders)
            .pipe(
                tap(
                    (error) => { this.handleError(error, () => this.createNotificationScheduler(data, notificationId)); }
                )
            );
    }

    applyInvoiceTypeToNotification(notificationId, voucherTypeId){
        const url: string = this.baseSectorAPIUrl + `notification/invoice/${notificationId}`;
        return this.httpClient.patch(url, {voucherTypeId: voucherTypeId}, this.requestHeaders)
            .pipe(
                tap(
                    (error) => {
                        this.handleError(error, () => this.applyInvoiceTypeToNotification(notificationId, voucherTypeId))
                    }
                )
            );
    }
}

@Injectable()
export class NotificationTemplateService extends OrgResourceService<NotificationTemplate> {
    public syncTemplate: EventEmitter<any> = new EventEmitter<any>();
    constructor(public override injector: Injector) {
        super(injector, `template`, new NotificationTemplateSerializer());
    }

    createTemplateScheduler(data: any, templateId: any) {
        const url: string = this.viewUrl+ `/scheduler/${templateId}`;
        return this.httpClient.post(url, data, this.requestHeaders)
            .pipe(
                tap(
                    (error) => {
                        this.handleError(error, () => this.createTemplateScheduler(data, templateId));
                    }
                )
            );
    }
}
