import {Injectable, Injector} from '@angular/core';
import {OrgResourceService} from "@app-global";
import {Project, ProjectSerializer} from "../domains/project.serializer";

@Injectable()
export class ProjectService extends OrgResourceService<Project>{
  constructor(public override injector: Injector) { super(injector, 'project', new ProjectSerializer()); }
}
