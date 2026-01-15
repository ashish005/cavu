import {Injectable, Injector} from '@angular/core';
import { Observable } from 'rxjs';
import {CoreEndpointBase} from "../../../../services";
import {PhaseTransition} from "../models";

@Injectable({ providedIn: 'root' })
export class WorkflowService extends CoreEndpointBase {
    constructor(override injector: Injector) { super(injector); }

    // Process + phases
    getAllProcess = (): Observable<any>=> this.httpClient.get<any>(`${super.baseSectorAPIUrl}/orgWorkflow/all`);
    getPhases = (processId: number): Observable<any> => this.httpClient.get(`${super.baseSectorAPIUrl}/orgWorkflow/${processId}/phases`);

    // transitions
    getTransitions(processId: number) {
        return this.httpClient.get<PhaseTransition[]>(`/api/processphases/transitions/${processId}`);
    }

    createTransition(dto: PhaseTransition) {
        return this.httpClient.post<PhaseTransition>(`/api/processphases/transitions`, dto);
    }

    updateTransition(id: number, dto: PhaseTransition) {
        return this.httpClient.put<PhaseTransition>(`/api/processphases/transitions/${id}`, dto);
    }

    deleteTransition(id: number) {
        return this.httpClient.delete(`/api/processphases/transitions/${id}`);
    }

    // Optional: persist phase position
    savePhasePosition(phaseId: number, x: number, y: number) {
        return this.httpClient.put(`/api/processphases/${phaseId}/position`, { x, y });
    }
}