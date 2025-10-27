import {Injectable, Injector} from "@angular/core";
import {MyTaskReminder, MyTaskReminderSerializer} from "../domains/my-task/my-task-reminder.serializer";
import  { OrgResourceService } from "@app-global";

@Injectable()
export class MyTaskReminderService extends OrgResourceService<MyTaskReminder>{
    constructor(public override injector: Injector) { super(injector, 'myOrgTask/reminder', new MyTaskReminderSerializer()); }
}
