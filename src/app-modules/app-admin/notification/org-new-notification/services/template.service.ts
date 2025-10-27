import  { OrgResourceService } from "@app-global";
import { map, tap } from "rxjs/operators";
import {EventEmitter, Injectable, Injector} from "@angular/core";
import {NotificationTemplate, NotificationTemplateSerializer} from "../domains/template.serializer";

@Injectable()
export class NotificationTemplateService extends OrgResourceService<NotificationTemplate> {
    public syncTemplate: EventEmitter<any> = new EventEmitter<any>();
    constructor(public injector: Injector) {
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
