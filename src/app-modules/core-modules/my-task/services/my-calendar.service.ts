import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {MyCalendar, MyCalendarSerializer} from "../domains/my-task/my-calendar.serializer";

@Injectable()
export class MyCalendarService extends OrgResourceService<MyCalendar>{
    constructor(public override injector: Injector) { super(injector, 'myOrgTask/calendar', new MyCalendarSerializer()); }
}
