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
        const url: string = this.viewUrl + `/lookup/${this.coreService.apiVersion}`;
        return this.httpClient.get(url, this.requestHeaders)
            .pipe(
                map(
                    (resp: any) => resp,
                    tap(
                        (error) => {
                            this.handleError(error, () => this.getRootOrgProcessLookups())
                        }
                    )
                )
            );
    }
}
