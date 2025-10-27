import {EventEmitter, Injectable, Injector} from "@angular/core";
import {map} from "rxjs/operators";
import {MyTask, MyTaskSerializer} from "../domains/my-task.serializer";
import  { OrgResourceService } from "@app-global";

@Injectable()
export class MyTaskService extends OrgResourceService<MyTask>{
  //get orgLoggedInUserId(){ return this.coreService.currentUser.id; }
  synchTask$: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(override injector: Injector) { super(injector, 'myOrgTask', new MyTaskSerializer()); }

  getReminderTemplates(){
    return this.httpClient
      .get(`${this.baseSectorAPIUrl}orgTask/reminder-templates`, this.requestHeaders)
      .pipe(map((resp: any) => resp.entities));
  }

  updateTaskReminders(participantId, data){
    return this.httpClient
      .put(`${this.baseSectorAPIUrl}orgTask/update-reminder-templates/${participantId}`, data, this.requestHeaders);
  }


  createTaskReminders(data){
    return this.httpClient
      .post(`${this.baseSectorAPIUrl}orgTask/update-reminder-templates`, data, this.requestHeaders);
  }

  createNotifiationGroup(data){
    return this.httpClient
      .post(`${this.baseSectorAPIUrl}orgTask/notification-group`, data, this.requestHeaders);
  }
}
