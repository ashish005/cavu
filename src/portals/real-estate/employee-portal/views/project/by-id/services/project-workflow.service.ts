import {Injectable, Injector} from '@angular/core';
import {map, tap} from "rxjs";
import  { OrgResourceService } from "@app-global";
import {ProjectWorkflow, ProjectWorkflowSerializer} from "../domains/project-workflow.serializer";

@Injectable()
export class ProjectWorkflowService extends OrgResourceService<ProjectWorkflow>{
    //public get orgUserId(){ return this.currentUser.id; }
    constructor(public override injector: Injector) { super(injector, 'projectWorkflow', new ProjectWorkflowSerializer()); }

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

    updateStatus(data){
        const url: string = `${this.viewUrl}/statusChange`;
        return this.httpClient.post(url, data, this.requestHeaders)
            .pipe(
                map(resp => resp),
                tap(
                    (error)=>{ this.handleError(error, () => this.updateStatus(data)) }
                )
            );
    }
}
