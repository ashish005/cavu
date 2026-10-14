import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, map} from "rxjs";
import {CoreEndpointBase} from "../../services/endpoint-base.service";

/** A record any module can attach work to: e.g. {type: 'compliance', id: '…', name: 'GST filing'}. Types are lowercase codes. */
export interface EntityRef { type: string; id: string; name?: string | null; }

export interface EntityProcessRow { id: string; code: string; name: string; workflowName: string; status: string; stageName: string | null; stageColor: string | null; isOverdue: boolean; openTasks: number; triggerName: string | null; }
export interface EntityTaskRow { id: string; name: string; status: string; priority: string; dueAt: string | null; isOverdue: boolean; assignee: {id: string; name: string} | null; processId: string | null; processName: string | null; }
export interface EntityScheduleRow { id: string; name: string; status: string; summary: string; nextDueAt: string | null; }
export interface EntityWorkflowRef { id: string; code: string; name: string; stageCount: number; }

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) { throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'}; }
    return resp?.data as T;
};

/**
 * The slice of the process API (`api/v1/process/*`) other modules need to show and start work for one of their
 * records. Everything is linked by entity type + id, so no module has to store process or schedule ids.
 */
@Injectable({providedIn: 'root'})
export class EntityWorkflowService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    private get url() { return `${this.baseSectorAPIUrl}/v1/process`; }

    private get<T>(path: string, query: Record<string, any> = {}): Observable<T> {
        let params = new HttpParams();
        Object.entries(query).filter(([, v]) => v !== null && v !== undefined && v !== '').forEach(([k, v]) => params = params.set(k, String(v)));
        return this.httpClient.get(`${this.url}/${path}`, {...this.requestHeaders, params}).pipe(map(r => unwrap<T>(r)));
    }

    private post<T>(path: string, body: any): Observable<T> {
        return this.httpClient.post(`${this.url}/${path}`, body, this.requestHeaders).pipe(map(r => unwrap<T>(r)));
    }

    processes(entity: EntityRef) {
        return this.get<{items: EntityProcessRow[]; total: number}>('processes', {entityType: entity.type, entityId: entity.id, take: 50});
    }

    tasks(entity: EntityRef) {
        return this.get<{items: EntityTaskRow[]; total: number}>('tasks', {scope: 'All', entityType: entity.type, entityId: entity.id, take: 50});
    }

    schedules(entity: EntityRef) {
        return this.get<{items: EntityScheduleRow[]; total: number}>('schedules', {entityType: entity.type, entityId: entity.id, take: 50});
    }

    workflows() { return this.get<{workflows: EntityWorkflowRef[]; isAdmin: boolean}>('lookups'); }

    startProcess(entity: EntityRef, workflowId: string, name?: string | null) {
        return this.post<{process: EntityProcessRow}>('processes', {workflowId, name: name || null, entityType: entity.type, entityId: entity.id, entityName: entity.name ?? null});
    }

    addTask(entity: EntityRef, name: string, dueAt: string | null) {
        return this.post<any>('tasks', {name, priority: 'Normal', isRequired: false, dueAt, entityType: entity.type, entityId: entity.id, entityName: entity.name ?? null});
    }

    /**
     * Tells workflows something happened to the record (e.g. 'approved'): triggers may start processes and running
     * processes about it may switch stage. Send a stable idempotencyKey so retries are not counted twice.
     */
    publishEvent(entity: EntityRef, eventName: string, payload: Record<string, any> = {}, idempotencyKey?: string) {
        return this.post<{id: string | null; duplicate: boolean}>('events', {
            entityType: entity.type, entityId: entity.id, entityName: entity.name ?? null, eventName, payload, idempotencyKey: idempotencyKey ?? null
        });
    }
}

export const workflowErrorOf = (error: any, fallback: string): string => {
    const body = error?.error;
    const validation = body?.errors && typeof body.errors === 'object' ? Object.values(body.errors).flat().filter(Boolean).join(' ') : null;
    return validation || body?.detail || body?.message || error?.message || fallback;
};
