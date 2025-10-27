import {Injectable, Injector} from "@angular/core";
import {OrgTaskCalendarService} from "@app-plugins";
@Injectable()
export class TaskCalendarService extends OrgTaskCalendarService {
    constructor(public injector: Injector){ super(injector); }
}