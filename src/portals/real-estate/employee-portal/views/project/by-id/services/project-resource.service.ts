import {Injectable, Injector} from '@angular/core';
import {OrgResourceService} from "@app-global";
import {map, tap} from "rxjs/operators";
import {ProjectResource, ProjectResourceSerializer} from "../domains/project-resource.serializer";

@Injectable()
export class ProjectResourceService extends OrgResourceService<ProjectResource>{
    constructor(public override injector: Injector) { super(injector, 'projectResource', new ProjectResourceSerializer()); }

    createEmployee(data){
        const url: string = `${this.viewUrl}/employee`;
        return this.httpClient.post(url, data, this.requestHeaders)
            .pipe(
                map(resp => resp),
                tap(
                    (error)=>{ this.handleError(error, () => this.createEmployee(data)) }
                )
            );
    }
}
