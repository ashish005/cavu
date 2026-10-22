import {Injectable, Injector} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable, catchError, map, of, shareReplay} from "rxjs";
import {CoreEndpointBase} from "@app-global";
import {
    Attachment, Dashboard, EntityType, EventQuery, Page, ProcessDetail, ProcessLookups, ProcessQuery, ProcessRow, ScheduleDefinition, ScheduleDetail,
    SchedulePreview, ScheduleRow, ScheduleRun, StartProcess, TaskDetail, TaskQuery, TaskRow, TaskSave, TaskStatus, Trigger,
    TriggerTestResult, Workflow, WorkflowEvent, WorkflowSummary
} from "../domains/process.models";

/** The API reports failures as `{isSuccess:false,message}`, ProblemDetails (`detail`) or validation problems (`errors`). */
export const errorMessageOf = (error: any, fallback: string): string => {
    const body = error?.error;
    const validation = body?.errors && typeof body.errors === 'object'
        ? Object.values(body.errors).flat().filter(Boolean).join(' ')
        : null;
    return validation || body?.detail || body?.message || error?.message || fallback;
};

const unwrap = <T>(resp: any): T => {
    if (resp && resp.isSuccess === false) {
        throw {status: 200, error: resp, message: resp.message || 'The request was rejected.'};
    }
    return resp?.data as T;
};

const toParams = (query: object): HttpParams => {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
        if (value !== null && value !== undefined && value !== '') {
            params = params.set(key, String(value));
        }
    }
    return params;
};

/** Tenant API `api/v1/process/*`. Provided once on the module so lookups are fetched once per visit. */
@Injectable()
export class ProcessApiService extends CoreEndpointBase {
    private lookups$: Observable<ProcessLookups> | null = null;

    constructor(public override injector: Injector) { super(injector); }

    private get url() { return `${this.baseSectorAPIUrl}/v1/process`; }

    private get<T>(path: string, query: object = {}): Observable<T> {
        return this.httpClient.get(`${this.url}/${path}`, {...this.requestHeaders, params: toParams(query)}).pipe(
            map(r => unwrap<T>(r)),
            catchError(e => this.handleError(e, () => this.get<T>(path, query)))
        );
    }

    private send<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body: any = {}): Observable<T> {
        return this.httpClient.request(method, `${this.url}/${path}`, {...this.requestHeaders, body}).pipe(
            map(r => unwrap<T>(r)),
            catchError(e => this.handleError(e, () => this.send<T>(method, path, body)))
        );
    }

    lookups(refresh = false): Observable<ProcessLookups> {
        if (refresh || !this.lookups$) {
            this.lookups$ = this.get<ProcessLookups>('lookups').pipe(shareReplay({bufferSize: 1, refCount: false}));
        }
        return this.lookups$;
    }

    dashboard(query: {days: number; workflowId?: string | null; teamId?: string | null}) { return this.get<Dashboard>('dashboard', query); }

    // Tasks
    tasks(query: TaskQuery) { return this.get<Page<TaskRow>>('tasks', query); }
    task(id: string) { return this.get<TaskDetail>(`tasks/${id}`); }
    createTask(body: TaskSave) { return this.send<TaskDetail>('POST', 'tasks', body); }
    updateTask(id: string, body: TaskSave) { return this.send<TaskDetail>('PUT', `tasks/${id}`, body); }
    setTaskStatus(id: string, status: TaskStatus, remark?: string | null) { return this.send<TaskDetail>('POST', `tasks/${id}/status`, {status, remark}); }
    takeTask(id: string) { return this.send<TaskDetail>('POST', `tasks/${id}/take`); }

    // Processes
    processes(query: ProcessQuery) { return this.get<Page<ProcessRow>>('processes', query); }
    process(id: string) { return this.get<ProcessDetail>(`processes/${id}`); }
    startProcess(body: StartProcess) { return this.send<ProcessDetail>('POST', 'processes', body); }
    processAction(id: string, action: 'approve' | 'move' | 'hold' | 'resume' | 'cancel', body: {remark?: string | null; stageId?: string | null} = {}) {
        return this.send<ProcessDetail>('POST', `processes/${id}/${action}`, body);
    }

    // Workflows
    workflows(includeInactive = true) { return this.get<WorkflowSummary[]>('workflows', {includeInactive}); }
    workflow(id: string) { return this.get<Workflow>(`workflows/${id}`); }
    saveWorkflow(workflow: Workflow) {
        this.lookups$ = null;
        return workflow.id ? this.send<Workflow>('PUT', `workflows/${workflow.id}`, workflow) : this.send<Workflow>('POST', 'workflows', workflow);
    }
    deleteWorkflow(id: string) { this.lookups$ = null; return this.send<void>('DELETE', `workflows/${id}`); }

    // Schedules
    schedules(query: {search?: string | null; entityType?: string | null; entityId?: string | null; skip?: number; take?: number} = {}) { return this.get<Page<ScheduleRow>>('schedules', query); }
    schedule(id: string) { return this.get<ScheduleDetail>(`schedules/${id}`); }
    previewSchedule(definition: ScheduleDefinition) { return this.send<SchedulePreview>('POST', 'schedules/preview', definition); }
    saveSchedule(id: string | null, definition: ScheduleDefinition) {
        return id ? this.send<ScheduleDetail>('PUT', `schedules/${id}`, definition) : this.send<ScheduleDetail>('POST', 'schedules', definition);
    }
    scheduleAction(id: string, action: 'pause' | 'resume') { return this.send<ScheduleDetail>('POST', `schedules/${id}/${action}`); }
    deleteSchedule(id: string) { return this.send<void>('DELETE', `schedules/${id}`); }
    scheduleRuns(id: string, skip = 0, take = 25) { return this.get<Page<ScheduleRun>>(`schedules/${id}/runs`, {skip, take}); }

    // Triggers and events
    triggers() { return this.get<Trigger[]>('triggers'); }
    saveTrigger(trigger: Trigger) {
        return trigger.id ? this.send<Trigger>('PUT', `triggers/${trigger.id}`, trigger) : this.send<Trigger>('POST', 'triggers', trigger);
    }
    deleteTrigger(id: string) { return this.send<void>('DELETE', `triggers/${id}`); }
    entityTypes() { return this.get<{types: EntityType[]}>('triggers/entity-types').pipe(map(r => r.types)); }
    testTrigger(body: {entityType: string; eventName: string; payload: any; condition?: any; nameTemplate?: string | null; notify?: any; entityId?: string | null}) {
        return this.send<TriggerTestResult>('POST', 'triggers/test', body);
    }
    // Attachments
    uploadAttachment(file: File): Observable<Attachment> {
        const form = new FormData();
        form.append('file', file, file.name);
        return this.httpClient.post(`${this.url}/attachments`, form, this.getMultipartFileUploadRequestHeaders).pipe(
            map(r => unwrap<Attachment>(r)),
            catchError(e => this.handleError(e, () => this.uploadAttachment(file)))
        );
    }
    attachments(ids: string[]) { return ids.length ? this.get<Attachment[]>('attachments', {ids: ids.join(',')}) : of([] as Attachment[]); }
    /** Downloads with the user's credentials (a plain link would lack the auth and tenant headers). */
    downloadAttachment(a: Attachment) {
        return this.httpClient.get(`${this.url}/attachments/${a.id}/content`, {...this.getMultipartFileUploadRequestHeaders, responseType: 'blob'} as any).pipe(
            map((blob: any) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = a.fileName;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            })
        );
    }

    events(query: EventQuery) { return this.get<Page<WorkflowEvent>>('events', query); }
    retryEvent(id: string) { return this.send<WorkflowEvent>('POST', `events/${id}/retry`); }
    publishEvent(body: {entityType: string; entityId: string; entityName?: string | null; eventName: string; payload?: any; idempotencyKey?: string | null}) {
        return this.send<{id: string | null; duplicate: boolean}>('POST', 'events', body);
    }
}
