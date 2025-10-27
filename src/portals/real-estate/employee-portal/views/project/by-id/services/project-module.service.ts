import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global";
import { throwError, map, tap } from "rxjs";
import {ProjectModule, ProjectModuleSerializer} from "../domains/project-module.serializer";

@Injectable()
export class ProjectModuleService extends OrgResourceService<ProjectModule>{
    //public get employeeUserId(){ return this.coreService.currentUser.id; }
    constructor(public override injector: Injector) { super(injector, 'projectModule', new ProjectModuleSerializer()); }

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
