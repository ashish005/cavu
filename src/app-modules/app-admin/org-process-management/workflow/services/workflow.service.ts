import {Injectable, Injector} from '@angular/core';
import {Observable, map, catchError} from 'rxjs';
import {Phase, PhaseSerializer, PhaseTransition} from "../domains/org-workflow-node.serializer";
import {OrgResourceService} from "@app-global";
import {OrgWorkflow, OrgWorkflowSerializer} from "../domains/org-workflow.serializer";

@Injectable()
export class WorkflowService extends OrgResourceService<OrgWorkflow>{
    constructor(public override injector: Injector) {
        super(injector, 'orgWorkflow', new OrgWorkflowSerializer());
    }

    getTransitions(workflowId: number): Observable<PhaseTransition[]> {
        const url = `${this.viewUrl}/${workflowId}/transitions`;
        return this.httpClient
            .get<any>(url, super.requestHeaders)
            .pipe(
                map((resp: any) => {
                    const items = resp?.entities || resp?.Entities || resp?.data || [];
                    return (items as any[]).map(x => ({
                        id: x.id,
                        processId: x.workflowId,
                        fromPhaseId: x.fromPhaseId,
                        toPhaseId: x.toPhaseId,
                        description: x.description || `${x.fromPhaseName} → ${x.toPhaseName}`,
                        rule: ''
                    }) as PhaseTransition);
                }),
                catchError(error => super.handleError(error, () => this.getTransitions(workflowId)))
            );
    }

    createTransition(workflowId: number, payload: any): Observable<PhaseTransition> {
        const url = `${this.viewUrl}/${workflowId}/transitions`;
        const body = {
            fromPhaseId: payload.fromPhaseId,
            toPhaseId: payload.toPhaseId,
            isAllowed: true,
            description: payload.description
        };
        return this.httpClient
            .post<any>(url, body, super.requestHeaders)
            .pipe(
                map((resp: any) => {
                    const x = resp?.data || resp;
                    return {
                        id: x.id,
                        processId: x.workflowId,
                        fromPhaseId: x.fromPhaseId,
                        toPhaseId: x.toPhaseId,
                        description: x.description,
                        rule: ''
                    } as PhaseTransition;
                }),
                catchError(error => super.handleError(error, () => this.createTransition(workflowId, payload)))
            );
    }

    updateTransition(id: number, payload: any): Observable<PhaseTransition> {
        const url = `${this.viewUrl}/transitions/${id}`;
        const body = {
            fromPhaseId: payload.fromPhaseId,
            toPhaseId: payload.toPhaseId,
            isAllowed: true,
            description: payload.description
        };
        return this.httpClient
            .put<any>(url, body, super.requestHeaders)
            .pipe(
                map((resp: any) => {
                    const x = resp?.data || resp;
                    return {
                        id: x.id,
                        processId: x.workflowId,
                        fromPhaseId: x.fromPhaseId,
                        toPhaseId: x.toPhaseId,
                        description: x.description,
                        rule: ''
                    } as PhaseTransition;
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
export class OrgProcessPhaseService extends OrgResourceService<Phase>{
    constructor(public override injector: Injector) { super(injector, 'OrgProcessPhase', new PhaseSerializer()); }
    // Process + phases
    getAllProcess = (): Observable<any>=> this.httpClient.get<any>(`${super.baseSectorAPIUrl}/orgWorkflow/all`);

    // transitions
    // getTransitions(processId: number) {
    //     return this.httpClient.get<PhaseTransition[]>(`/api/processphases/transitions/${processId}`);
    // }
    //
    // createTransition(dto: PhaseTransition) {
    //     return this.httpClient.post<PhaseTransition>(`/api/processphases/transitions`, dto);
    // }
    //
    // updateTransition(id: number, dto: PhaseTransition) {
    //     return this.httpClient.put<PhaseTransition>(`/api/processphases/transitions/${id}`, dto);
    // }
    //
    // deleteTransition(id: number) {
    //     return this.httpClient.delete(`/api/processphases/transitions/${id}`);
    // }
    //
    // // Optional: persist phase position
    // savePhasePosition(phaseId: number, x: number, y: number) {
    //     return this.httpClient.put(`/api/processphases/${phaseId}/position`, { x, y });
    // }
}
