import {Injectable, Injector} from '@angular/core';
import {throwError} from "rxjs";
import {
    ProjectProcess, ProjectProcessSerializer,
} from "../domains/project-process.serializer";
import {map, tap} from "rxjs";
import  { OrgResourceService } from "@app-global";

@Injectable()
export class ProjectWorkflowService extends OrgResourceService<ProjectProcess>{
    //public get orgUserId(){ return this.coreService.currentUser.id; }
    constructor(public override injector: Injector) { super(injector, 'projectWorkflow', new ProjectProcessSerializer()); }

    createProjectTask(data)
    {
        const url: string = `${this.viewUrl}/projectTask`;
        return this.httpClient.post(url, data, this.requestHeaders)
            .pipe(
                map(resp => resp),
                tap(
                    (error)=>{ this.handleError(error, () => this.updateWorkflow(data)) }
                )
            );
    }

    updateOrgTask(orgTaskId, data)
    {
        const url: string = `${this.viewUrl}/projectTask/${orgTaskId}`;
        return this.httpClient.put(url, data, this.requestHeaders)
            .pipe(
                map(resp => resp),
                tap(
                    (error)=>{ this.handleError(error, () => this.updateWorkflow(data)) }
                )
            );
    }

    updateWorkflow(data){
        const url: string = `${this.viewUrl}/change`;
        return this.httpClient.post(url, data, this.requestHeaders)
            .pipe(
                map(resp => resp),
                tap(
                    (error)=>{ this.handleError(error, () => this.updateWorkflow(data)) }
                )
            );
    }

    /*updateStatus(data){
        const url: string = `${super.baseSectorAPIUrl}projectWorkflow/statusChange`;
        return this.httpClient.post(url, data, this.requestHeaders)
            .pipe(
                map(resp => resp),
                tap(
                    (error)=>{ this.handleError(error, () => this.updateStatus(data)) }
                )
            );
    }*/
}
