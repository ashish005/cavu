import {Injectable, Injector} from '@angular/core';
import {map, tap, catchError} from "rxjs";
import {OrgResourceService} from "../../../../services";
import {
    ProcessWorkflowQueryOptions, WorkflowOrgProcess, WorkflowOrgProcessSerializer
} from "../domains/process-workflow.serializer";
import {ProcessWorkflowAdvance, ProcessWorkflowAdvanceSerializer} from "../domains/process-workflow-advance.serializer";

@Injectable()
export class CoreProcessWorkflowService extends OrgResourceService<WorkflowOrgProcess> {
    constructor(public override injector: Injector) {
        super(injector, `processWorkflow`, new WorkflowOrgProcessSerializer());
    }

    public getAll(queryOptions: ProcessWorkflowQueryOptions) {
        return this.httpClient
            .get(`${this.viewUrl}/all?${queryOptions.toQueryString()}`, this.requestHeaders)
            .pipe(
                map(data => data),
                catchError(error => this.handleError(error, () => this.getAll(queryOptions)))
            );
    }
}

@Injectable()
export class AdvancedWorkflowService extends OrgResourceService<ProcessWorkflowAdvance> {
    constructor(public override injector: Injector) {
        super(injector, `processWorkflow/advanced`, new ProcessWorkflowAdvanceSerializer());
    }
}