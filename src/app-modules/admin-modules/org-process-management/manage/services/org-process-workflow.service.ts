import {EventEmitter, Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {map, tap} from "rxjs";
import {OrgProcessWorkflow, OrgProcessWorkflowSerializer} from "../domains/org-process-workflow.serializer";

@Injectable()
export class OrgProcessWorkflowService extends OrgResourceService<OrgProcessWorkflow>{
  constructor(public override injector: Injector) {
    super(injector, 'processWorkflow', new OrgProcessWorkflowSerializer());
  }

    getRootOrgProcessLookups() {
        const url: string = this.viewUrl + `/lookup/${super.apiVersion}`;
        return this.httpClient.get(url, super.requestHeaders)
            .pipe(
                map(
                    (resp: any) => resp,
                    tap(
                        (error) => {
                            super.handleError(error, () => this.getRootOrgProcessLookups())
                        }
                    )
                )
            );
    }
}
