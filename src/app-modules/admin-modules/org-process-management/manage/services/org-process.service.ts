import {EventEmitter, Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global"
import {OrgProcess, OrgProcessSerializer} from "../domains/org-process.serializer";
import {ProcessTracker, ProcessTrackerSerializer} from "../domains/process-tracker.serializer";

@Injectable()
export class OrgProcessService extends OrgResourceService<OrgProcess>{
  constructor(public override injector: Injector) {
    super(injector, 'orgProcess', new OrgProcessSerializer());
  }
}

@Injectable()
export class OrgProcessTrackerService extends OrgResourceService<ProcessTracker>{
  constructor(public override injector: Injector) { super(injector, 'process', new ProcessTrackerSerializer()); }
  /*updateStatus(taskId: number, newStatusId: number): Observable<any> {
    return this.httpClient.patch(`${this.viewUrl}/${taskId}/status`, { processStatus: newStatusId }, this.requestHeaders)
        .pipe(
            catchError(error => this.handleError(error, () => this.updateStatus(taskId, newStatusId)))
        );
  }*/
  getProcesses() { return this.httpClient.get(`${this.viewUrl}`, this.requestHeaders); }
  getPhases(processId: number) { return this.httpClient.get(`${this.viewUrl}/phases/process/${processId}`, this.requestHeaders); }
  getTransitions(processId: number) { return this.httpClient.get(`${this.viewUrl}/transitions/process/${processId}`, this.requestHeaders); }
  moveTask(taskId: number, toPhaseId: number) { return this.httpClient.put(`${this.viewUrl}/phases/${taskId}/move`, toPhaseId, this.requestHeaders); }


  getProcessesBoard() {
    return this.httpClient.get<OrgProcess[]>(`${this.viewUrl}/board`, this.requestHeaders);
  }

  moveProcess(processId: number, toPhaseId: number) {
    return this.httpClient.patch(`${this.viewUrl}/${processId}/move`, { toPhaseId }, this.requestHeaders);
  }
}