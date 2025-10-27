import {Injectable, Injector} from "@angular/core";
import {TaskReminder, TaskReminderSerializer} from "../domains/task-reminder.serializer";
import  { OrgResourceService } from "@app-global";

@Injectable()
export class TaskReminderService extends OrgResourceService<TaskReminder>{
    constructor(public override injector: Injector){
        super(injector, 'taskReminder', new TaskReminderSerializer());
    }
}
