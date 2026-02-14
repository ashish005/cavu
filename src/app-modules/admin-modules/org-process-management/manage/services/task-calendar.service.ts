import {Injectable, Injector} from "@angular/core";
import {OrgTaskCalendar, OrgTaskCalendarSerializer} from "../domains/org-task-calendar.serializer";
import { OrgResourceService } from "@app-global";

@Injectable()
export class TaskCalendarService extends OrgResourceService<OrgTaskCalendar>{
    constructor(public override injector: Injector) {
        super(injector, 'taskCalendar', new OrgTaskCalendarSerializer());
    }
}