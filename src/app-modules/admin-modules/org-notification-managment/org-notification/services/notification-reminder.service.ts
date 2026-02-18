import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {NotificationReminder, NotificationReminderSerializer} from "../domains/reminder.serializer";

@Injectable()
export class NotificationReminderService extends OrgResourceService<NotificationReminder>{
    constructor(public override injector: Injector) { super(injector, 'access-setup/notificationReminder', new NotificationReminderSerializer()); }
}
