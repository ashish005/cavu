import {OrgResourceService} from "@app-global";
import { map, tap } from "rxjs/operators";
import {EventEmitter, Injectable, Injector} from "@angular/core";
import {OrgNotification, OrgNotificationSerializer} from "../domains/notification.serializer";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";

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
export class NotificationByIdResolver implements Resolve<any> {
    constructor(public service: NotificationService) {}

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {};
        const failure = (err: any) => {};
        const setup = this.service.read(route.params.notificationId);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}
