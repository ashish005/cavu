import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@app-environments';
import { DEFAULT_INDUSTRY_KEY, DEFAULT_WORKSPACE_KEY, IndustryProfile, WorkspaceConfig } from './workspace-config';

export interface StudioEntity {
  id: string; name: string; classification: string; score: number; stage: string;
  source: string; evidenceJson: string; contactJson?: string; createdAt: string;
}
export interface Evidence { label: string; source: string; verified: boolean }
export interface Run { id: string; query: string; sourcesJson: string; results: number; ranAt: string }
export interface Booking { id: string; entityId: string; slot: string; status: string; createdAt: string }
export interface Kpis { total: number; qualified: number; avgScore: number; pendingBookings: number; runs7d: number }
interface RawWorkspace { key: string; label: string; description: string; icon: string; routesJson: string; capabilitiesJson: string }
interface RawIndustry { key: string; label: string; stagesJson: string; capabilitiesJson: string }
interface StudioConfig { workspaces: RawWorkspace[]; industries: RawIndustry[] }

export interface Thread { id: string; entityId?: string; channel: string; subject: string; status: string; createdAt: string }
export interface Msg { id: string; direction: string; body: string; isAi: boolean; sentAt: string }
export interface Agent { id: string; name: string; purpose: string; configJson: string; status: string; createdAt: string }
export interface AgentRunRec { id: string; agentId: string; input: string; output?: string; status: string; ranAt: string }
export interface Workflow { id: string; name: string; definitionJson: string; status: string; version: number; createdAt: string }
export interface Exec { id: string; workflowId: string; status: string; error?: string; startedAt: string; finishedAt?: string }
export interface Campaign { id: string; name: string; channel: string; scheduleJson?: string; status: string; createdAt: string }
export interface Appt { id: string; entityId?: string; startUtc: string; durationMinutes: number; notes?: string; status: string; createdAt: string }
export interface Schedule { id: string; workflowId: string; cron: string; enabled: boolean; lastRunAt?: string; nextRunAt?: string }
export interface Hook { id: string; url: string; eventsJson: string; isActive: boolean; failureCount: number; createdAt: string }
export interface Job { id: string; jobType: string; status: string; attempts: number; maxAttempts: number; lastError?: string; runAt: string; createdAt: string }
export interface ThreadPage { items: Thread[]; nextCursor?: number }
export interface MessagePage { items: Msg[]; nextCursor?: number }
export interface RunPage { items: AgentRunRec[]; nextCursor?: number }
export interface ApptPage { items: Appt[]; nextCursor?: number }
export interface JobPage { items: Job[]; nextCursor?: number }
export interface PagedResult<T> { items: T[]; page: number; pageSize: number; totalCount: number; totalPages: number; hasNext: boolean; hasPrevious: boolean }

const base = `${(environment as any).leadUrl ?? 'http://localhost:5260'}/api/studio`;
const parse = <T>(j: string): T => { try { return JSON.parse(j); } catch { return [] as any; } };

@Injectable({ providedIn: 'root' })
export class AiStudioService {
  private http = inject(HttpClient);
  private workspaces: WorkspaceConfig[] = [];
  private industries: IndustryProfile[] = [];
  configLoaded = false;

  private ws$ = new BehaviorSubject<WorkspaceConfig | null>(null);
  private ind$ = new BehaviorSubject<IndustryProfile | null>(null);
  readonly workspace$ = this.ws$.asObservable();
  readonly industry$ = this.ind$.asObservable();
  readonly entities$ = new BehaviorSubject<StudioEntity[]>([]);
  readonly runs$ = new BehaviorSubject<Run[]>([]);
  readonly bookings$ = new BehaviorSubject<Booking[]>([]);
  readonly kpis$ = new BehaviorSubject<Kpis>({ total: 0, qualified: 0, avgScore: 0, pendingBookings: 0, runs7d: 0 });

  constructor() { this.loadConfig(); }

  loadConfig(): Observable<StudioConfig> {
    return this.http.get<StudioConfig>(`${base}/config`).pipe(
      tap(cfg => {
        this.workspaces = cfg.workspaces.map(w => ({
          id: w.key, key: w.key, label: w.label, description: w.description, icon: w.icon,
          routes: parse(w.routesJson), capabilities: parse(w.capabilitiesJson),
        }));
        this.industries = cfg.industries.map(i => ({
          key: i.key, label: i.label, stages: parse(i.stagesJson), capabilities: parse(i.capabilitiesJson),
        }));
        this.configLoaded = true;
        this.applyStoredSelections();
      }),
      catchError(() => of({ workspaces: [], industries: [] } as StudioConfig)),
    );
  }

  get workspace(): WorkspaceConfig { return this.ws$.value ?? this.workspaces[0]; }
  get industry(): IndustryProfile { return this.ind$.value ?? this.industries[0]; }
  get workspaceList(): WorkspaceConfig[] { return this.workspaces; }
  get industryList(): IndustryProfile[] { return this.industries; }

  private applyStoredSelections() {
    const wk = localStorage.getItem(DEFAULT_WORKSPACE_KEY);
    const ik = localStorage.getItem(DEFAULT_INDUSTRY_KEY);
    const def = this.workspaces.find(w => w.key === 'business-growth') ?? this.workspaces[0];
    this.ws$.next(this.workspaces.find(w => w.key === wk) ?? def ?? null);
    const defI = this.industries.find(i => i.key === 'saas') ?? this.industries[0];
    this.ind$.next(this.industries.find(i => i.key === ik) ?? defI ?? null);
  }

  setWorkspace(key: string) {
    const ws = this.workspaces.find(w => w.key === key); if (!ws) return;
    localStorage.setItem(DEFAULT_WORKSPACE_KEY, key); this.ws$.next(ws);
  }
  setIndustry(key: string) {
    const ind = this.industries.find(i => i.key === key); if (!ind) return;
    localStorage.setItem(DEFAULT_INDUSTRY_KEY, key); this.ind$.next(ind);
  }
  reset() {
    [DEFAULT_WORKSPACE_KEY, DEFAULT_INDUSTRY_KEY].forEach(k => localStorage.removeItem(k));
    this.applyStoredSelections(); this.refreshAll();
  }

  refreshAll() {
    this.listEntities().subscribe({ error: () => {} });
    this.listRuns().subscribe({ error: () => {} });
    this.listBookings().subscribe({ error: () => {} });
    this.kpis().subscribe({ error: () => {} });
  }

  evidenceOf(e: StudioEntity): Evidence[] { try { return JSON.parse(e.evidenceJson || '[]'); } catch { return []; } }

  // ---- core studio ----
  listEntities(classification?: string): Observable<StudioEntity[]> {
    return this.listEntitiesPaged(classification, 1, 200).pipe(map(p => { this.entities$.next(p.items); return p.items; }));
  }
  listEntitiesPaged(classification: string | undefined, page: number, pageSize: number): Observable<PagedResult<StudioEntity>> {
    const params = [`page=${page}`, `pageSize=${pageSize}`];
    if (classification) params.push(`classification=${classification}`);
    return this.http.get<PagedResult<StudioEntity>>(`${base}/entities?${params.join('&')}`);
  }
  createEntity(e: Partial<StudioEntity>): Observable<StudioEntity> {
    return this.http.post<StudioEntity>(`${base}/entities`, e).pipe(tap(() => this.refreshAll()));
  }
  moveStage(id: string, stage: string): Observable<void> {
    return this.http.put<void>(`${base}/entities/${id}/stage`, { stage }).pipe(tap(() => this.refreshAll()));
  }
  updateEntity(id: string, e: Partial<StudioEntity>): Observable<StudioEntity> {
    return this.http.put<StudioEntity>(`${base}/entities/${id}`, e).pipe(tap(() => this.refreshAll()));
  }
  listRuns(): Observable<Run[]> { return this.http.get<Run[]>(`${base}/runs`).pipe(tap(x => this.runs$.next(x))); }
  runDiscovery(query: string, sources: string[], maxResults = 5): Observable<Run> {
    return this.http.post<Run>(`${base}/runs`, { query, sources, maxResults }).pipe(tap(() => this.refreshAll()));
  }
  listBookings(): Observable<Booking[]> { return this.http.get<Booking[]>(`${base}/bookings`).pipe(tap(x => this.bookings$.next(x))); }
  createBooking(entityId: string, slot: string): Observable<Booking> {
    return this.http.post<Booking>(`${base}/bookings`, { entityId, slot }).pipe(tap(() => this.refreshAll()));
  }
  setBookingStatus(id: string, action: 'confirm' | 'cancel'): Observable<void> {
    return this.http.post<void>(`${base}/bookings/${id}/${action}`, {}).pipe(tap(() => this.refreshAll()));
  }
  kpis(): Observable<Kpis> { return this.http.get<Kpis>(`${base}/kpis`).pipe(tap(x => this.kpis$.next(x))); }

  // ---- EP-05 conversations ----
  listThreads(status?: string): Observable<ThreadPage> { return this.http.get<ThreadPage>(`${base}/threads${status ? `?status=${status}` : ''}`); }
  createThread(entityId: string | undefined, channel: string, subject: string): Observable<Thread> {
    return this.http.post<Thread>(`${base}/threads`, { entityId, channel, subject });
  }
  listMessages(threadId: string): Observable<MessagePage> { return this.http.get<MessagePage>(`${base}/threads/${threadId}/messages`); }
  postMessage(threadId: string, direction: string, body: string, isAi = false): Observable<Msg> {
    return this.http.post<Msg>(`${base}/threads/${threadId}/messages`, { direction, body, isAi });
  }
  closeThread(id: string): Observable<void> { return this.http.post<void>(`${base}/threads/${id}/close`, {}); }
  reopenThread(id: string): Observable<void> { return this.http.post<void>(`${base}/threads/${id}/reopen`, {}); }

  // ---- EP-06 agents ----
  listAgents(): Observable<Agent[]> { return this.http.get<Agent[]>(`${base}/agents`); }
  createAgent(name: string, purpose: string, configJson = '{}'): Observable<Agent> {
    return this.http.post<Agent>(`${base}/agents`, { name, purpose, configJson });
  }
  setAgentStatus(id: string, action: 'activate' | 'pause'): Observable<void> {
    return this.http.post<void>(`${base}/agents/${id}/${action}`, {});
  }
  runAgent(id: string, input: string): Observable<AgentRunRec> {
    return this.http.post<AgentRunRec>(`${base}/agents/${id}/run`, { input });
  }
  listAgentRuns(id: string): Observable<RunPage> { return this.http.get<RunPage>(`${base}/agents/${id}/runs`); }

  // ---- EP-07 workflows ----
  listWorkflows(): Observable<Workflow[]> { return this.http.get<Workflow[]>(`${base}/workflows`); }
  createWorkflow(name: string, definitionJson = '{}'): Observable<Workflow> {
    return this.http.post<Workflow>(`${base}/workflows`, { name, definitionJson });
  }
  activateWorkflow(id: string): Observable<void> { return this.http.post<void>(`${base}/workflows/${id}/activate`, {}); }
  executeWorkflow(id: string): Observable<Exec> { return this.http.post<Exec>(`${base}/workflows/${id}/execute`, {}); }

  // ---- EP-08 campaigns/appointments ----
  listCampaigns(): Observable<Campaign[]> { return this.http.get<Campaign[]>(`${base}/campaigns`); }
  createCampaign(name: string, channel: string, scheduleJson?: string): Observable<Campaign> {
    return this.http.post<Campaign>(`${base}/campaigns`, { name, channel, scheduleJson });
  }
  setCampaignStatus(id: string, action: 'activate' | 'pause'): Observable<void> {
    return this.http.post<void>(`${base}/campaigns/${id}/${action}`, {});
  }
  listAppointments(): Observable<ApptPage> { return this.http.get<ApptPage>(`${base}/appointments`); }
  createAppointment(entityId: string | undefined, startUtc: string, durationMinutes: number, notes?: string): Observable<Appt> {
    return this.http.post<Appt>(`${base}/appointments`, { entityId, startUtc, durationMinutes, notes });
  }
  cancelAppointment(id: string): Observable<void> { return this.http.post<void>(`${base}/appointments/${id}/cancel`, {}); }

  // ---- ops: schedules, webhooks, jobs, seed ----
  listSchedules(): Observable<Schedule[]> { return this.http.get<Schedule[]>(`${base}/schedules`); }
  createSchedule(workflowId: string, cron: string): Observable<Schedule> {
    return this.http.post<Schedule>(`${base}/schedules`, { workflowId, cron });
  }
  toggleSchedule(id: string): Observable<Schedule> { return this.http.post<Schedule>(`${base}/schedules/${id}/toggle`, {}); }
  deleteSchedule(id: string): Observable<void> { return this.http.delete<void>(`${base}/schedules/${id}`); }
  listHooks(): Observable<Hook[]> { return this.http.get<Hook[]>(`${base}/webhooks`); }
  createHook(url: string, eventsJson = '["*"]', secret?: string): Observable<Hook> {
    return this.http.post<Hook>(`${base}/webhooks`, { url, eventsJson, secret });
  }
  toggleHook(id: string): Observable<Hook> { return this.http.post<Hook>(`${base}/webhooks/${id}/toggle`, {}); }
  deleteHook(id: string): Observable<void> { return this.http.delete<void>(`${base}/webhooks/${id}`); }
  listJobs(status?: string): Observable<JobPage> { return this.http.get<JobPage>(`${base}/jobs${status ? `?status=${status}` : ''}`); }
  retryJob(id: string): Observable<void> { return this.http.post<void>(`${base}/jobs/${id}/retry`, {}); }
  pingProvider(url: string): Observable<{ ok: boolean; detail: string }> {
    return this.http.post<{ ok: boolean; detail: string }>(`${base}/providers/ping`, { url });
  }
  seedDemo(force = false, workspace?: string): Observable<{ records: number; message: string }> {
    const params = [force ? 'force=true' : '', workspace ? `workspace=${workspace}` : ''].filter(Boolean).join('&');
    return this.http.post<{ records: number; message: string }>(`${base}/seed-demo${params ? '?' + params : ''}`, {});
  }
}
