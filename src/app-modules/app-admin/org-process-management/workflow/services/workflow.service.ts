import {Injectable, Injector} from '@angular/core';
import {Observable, map, catchError} from 'rxjs';
import {OrgWorkflowPhase, OrgWorkflowPhaseSerializer, OrgWorkflowPhaseTransition} from "../domains/org-workflow-node.serializer";
import {OrgResourceService} from "@app-global";
import {OrgWorkflow, OrgWorkflowSerializer} from "../domains/org-workflow.serializer";
import {OrgWorkflowPhaseStepTask, OrgWorkflowPhaseStepTaskSerializer} from "../domains/phase-step-task.serializer";

@Injectable()
export class WorkflowService extends OrgResourceService<OrgWorkflow>{
    constructor(public override injector: Injector) {
        super(injector, 'orgWorkflow', new OrgWorkflowSerializer());
    }

  getTransitions(workflowId: number): Observable<OrgWorkflowPhaseTransition[]> {
        const url = `${this.viewUrl}/${workflowId}/transitions`;
        return this.httpClient
            .get<any>(url, super.requestHeaders)
            .pipe(
                map((resp: any) => {
                    const items = resp?.entities || resp?.Entities || resp?.data || [];
                    return (items as any[]).map(x => ({
                        id: x.id,
                        processId: x.processId,
                        fromPhaseId: x.fromPhaseId,
                        fromStatusId: x.fromStatusId,
                        fromPhaseName: x.fromPhaseName,
                        toPhaseId: x.toPhaseId,
                        toStatusId: x.toStatusId,
                        toPhaseName: x.toPhaseName,
                        description: x.description,
                        rule: x.rule
                    }));
                }),
                catchError(error => super.handleError(error, () => this.getTransitions(workflowId)))
            );
    }

    createTransition(workflowId: number, payload: any): Observable<OrgWorkflowPhaseTransition> {
        const url = `${this.viewUrl}/${workflowId}/transitions`;
        const body = {
            fromPhaseId: payload.fromPhaseId,
            fromStatusId: payload.fromStatusId,
            toPhaseId: payload.toPhaseId,
            toStatusId: payload.toStatusId,
            description: payload.description,
            rule: payload.rule
        };
        return this.httpClient
            .post<any>(url, body, super.requestHeaders)
            .pipe(
                map((resp: any) => {
                    return resp?.data || resp;
                }),
                catchError(error => super.handleError(error, () => this.createTransition(workflowId, payload)))
            );
    }

    updateTransition(id: number, payload: any): Observable<OrgWorkflowPhaseTransition> {
        const url = `${this.viewUrl}/transitions/${id}`;
        const body = {
            fromPhaseId: payload.fromPhaseId,
            fromStatusId: payload.fromStatusId,
            toPhaseId: payload.toPhaseId,
            toStatusId: payload.toStatusId,
            description: payload.description,
            rule: payload.rule
        };
        return this.httpClient
            .put<any>(url, body, super.requestHeaders)
            .pipe(
                map((resp: any) => {
                    return resp?.data || resp;
                }),
                catchError(error => super.handleError(error, () => this.updateTransition(id, payload)))
            );
    }

    deleteTransition(id: number): Observable<any> {
        const url = `${super.baseSectorAPIUrl}/OrgWorkflow/transitions/${id}`;
        return this.httpClient
            .delete<any>(url, super.requestHeaders)
            .pipe(
                catchError(error => super.handleError(error, () => this.deleteTransition(id)))
            );
    }
}

@Injectable()
export class OrgWorkflowPhaseService extends OrgResourceService<OrgWorkflowPhase>{
    constructor(public override injector: Injector) { super(injector, 'orgWorkflowPhase', new OrgWorkflowPhaseSerializer()); }
    // Process + phases
    getAllProcess = (): Observable<any>=> this.httpClient.get<any>(`${super.baseSectorAPIUrl}/orgWorkflow/all`);
}

@Injectable()
export class OrgWorkflowPhaseStepTaskService extends OrgResourceService<OrgWorkflowPhaseStepTask>{
    constructor(public override injector: Injector) {
        super(injector, 'OrgWorkflowPhaseStepTask', new OrgWorkflowPhaseStepTaskSerializer());
    }
}
