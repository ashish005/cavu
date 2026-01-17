import {Injectable, Injector} from '@angular/core';
import { Observable } from 'rxjs';
import {Phase, PhaseSerializer, PhaseTransition} from "../domains/org-workflow-node.serializer";
import {CoreEndpointBase, OrgResourceService} from "@app-global";
import {OrgWorkflow, OrgWorkflowSerializer} from "../domains/org-workflow.serializer";

@Injectable()
export class WorkflowService extends OrgResourceService<OrgWorkflow>{
    constructor(public override injector: Injector) {
        super(injector, 'orgWorkflow', new OrgWorkflowSerializer());
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

