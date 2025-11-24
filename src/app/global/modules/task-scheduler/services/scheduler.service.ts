import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "../../../services";
import {catchError, map} from "rxjs";
import {SchedularDomain, SchedularDomainSerializer, SchedulerTaskParam} from "../domains/schedular.domain";
@Injectable({providedIn: 'root'})
export class SchedulerService extends OrgResourceService<SchedularDomain> {
    public readonly lookup: any;
    constructor(public override injector: Injector) {
        super(injector, 'taskSchedule', new SchedularDomainSerializer());
        //this.lookup = this.appLookup;
    }

  getOrgSchedulerById(id: string) {
    return this.httpClient.get(`${this.viewUrl}/${id}`, this.requestHeaders)
          .pipe(
              map((resp: any) => new SchedularDomain(resp.data)),
              catchError(error => this.handleError(error, () => this.getOrgSchedulerById(id)))
          );
  }

  addScheduler(data: any){
      return this.httpClient.post(`${this.viewUrl}`, data, this.requestHeaders)
        .pipe(
            map((resp: any) => resp),
            catchError(error => this.handleError(error, () => this.addScheduler(data)))
        );
  }

  updateScheduler(id: number, data: any){
      return this.httpClient.put(`${this.viewUrl}/${id}`, data, this.requestHeaders)
        .pipe(
            map((resp: any) => resp),
            catchError(error => this.handleError(error, () => this.updateScheduler(id, data)))
        );
  }

  testScheduler(data: SchedularDomain){
      return this.httpClient.post(`${this.viewUrl}/test`, data, this.requestHeaders)
          .pipe(
              map((resp: any) => resp),
              catchError(error => this.handleError(error, () => this.testScheduler(data)))
          );
  }

  getOrgTaskScheduleLookup(taskParam: SchedulerTaskParam){
    return this.httpClient
      .get(`${this.baseSectorAPIUrl}/orgTask/scheduleLookup?${taskParam.toQueryString()}`, this.requestHeaders)
      .pipe(
          map((resp: any) => resp.entities),
          catchError(error => this.handleError(error, () => this.getOrgTaskScheduleLookup(taskParam)))
      );
  }

  /*addScheduler(data: SchedularDomain){
    return this.httpClient.post(`${this.configService.baseApiUrl}task-schedule`, SchedularParser.serializeDetails(data), this.requestHeaders).pipe(map((resp: any) => resp));
  }

  updateScheduler(id: string, data: SchedularDomain){
    return this.httpClient.put(`${this.configService.baseApiUrl}task-schedule/${id}`, SchedularParser.serializeDetails(data), this.requestHeaders).pipe(map((resp: any) => resp));
  }*/
}
