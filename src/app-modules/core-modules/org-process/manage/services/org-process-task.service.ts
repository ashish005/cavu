import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {map} from "rxjs/operators";
import {
    OrgTask,
    OrgTaskSerializer
} from "../domains/org-task.serializer";
import {OrgTaskSummaryRow, OrgTaskSummaryRowSerializer} from "../domains/org-task-summary.serializer";

@Injectable()
export class OrgTaskSummaryService extends OrgResourceService<OrgTaskSummaryRow>{
  constructor(public override injector: Injector) {
    super(injector, 'taskSchedulerSummary', new OrgTaskSummaryRowSerializer());
  }

    logRunStatusChange(runLogId, data){ return this.httpClient.put(`${this.baseSectorAPIUrl}myOrgTask/run-status/${runLogId}/change`, data, this.requestHeaders); }

    getReminderTemplates(){
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}orgTask/reminder-templates`, this.requestHeaders)
            .pipe(map((resp: any) => resp.entities));
    }

    updateTaskReminders(participantId, data){
        return this.httpClient.put(`${this.baseSectorAPIUrl}orgTask/update-reminder-templates/${participantId}`, data, this.requestHeaders);
    }


    createTaskReminders(data){
        return this.httpClient.post(`${this.baseSectorAPIUrl}orgTask/update-reminder-templates`, data, this.requestHeaders);
    }

    createNotifiationGroup(data){
        return this.httpClient.post(`${this.baseSectorAPIUrl}orgTask/notification-group`, data, this.requestHeaders);
    }
}

@Injectable()
export class OrgTaskService extends OrgResourceService<OrgTask>{
    constructor(public override injector: Injector) {
        super(injector, 'orgTask', new OrgTaskSerializer());
    }
}

