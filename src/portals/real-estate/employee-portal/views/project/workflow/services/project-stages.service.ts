import {Injectable, Injector} from '@angular/core';
import {map, tap} from "rxjs";
import {ProjectStages, ProjectStagesSerializer} from "../domains/project-stages.serializer";
import  { OrgResourceService } from "@app-global";

@Injectable()
export class ProjectStagesService extends OrgResourceService<ProjectStages>{
    //public get orgUserId(){ return this.coreService.currentUser.id; }
    constructor(public override injector: Injector) { super(injector, 'projectWorkflow/stages', new ProjectStagesSerializer()); }

    updateStatus(data){
        const url: string = `${super.baseSectorAPIUrl}projectWorkflow/stagesChange`;
        return this.httpClient.post(url, data, this.requestHeaders)
            .pipe(
                map(resp => resp),
                tap(
                    (error)=>{ this.handleError(error, () => this.updateStatus(data)) }
                )
            );
    }
}
