import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface WorkspaceConfig { key: string; label: string; description: string; icon: string; routes: any[]; capabilities: string[] }
export interface IndustryProfile { key: string; label: string; stages: string[]; capabilities: string[] }
export interface StudioEntity {
  id: string; name: string; classification: string; score: number; stage: string;
  source: string; evidenceJson: string; contactJson?: string; createdAt: string;
}
export interface Evidence { label: string; source: string; verified: boolean }
export interface Run { id: string; query: string; sourcesJson: string; results: number; qualifiedCount?: number; geography?: string; ranAt: string }
export interface Booking { id: string; entityId: string; slot: string; status: string; createdAt: string }
export interface Kpis { total: number; qualified: number; avgScore: number; pendingBookings: number; runs7d: number; agentExec24h?: number; agentsActive?: number; agentsTotal?: number; handoffsPending?: number }
interface RawWorkspace { key: string; label: string; description: string; icon: string; routesJson: string; capabilitiesJson: string }
interface RawIndustry { key: string; label: string; stagesJson: string; capabilitiesJson: string }
interface StudioConfig { workspaces: RawWorkspace[]; industries: RawIndustry[] }

export interface Thread { id: string; entityId?: string; channel: string; subject: string; status: string; contactName?: string; handlingMode?: string; lastActivityAt?: string; createdAt: string }
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
  private ws$ = new BehaviorSubject<WorkspaceConfig | null>(null);
  private ind$ = new BehaviorSubject<IndustryProfile | null>(null);
  readonly workspace$ = this.ws$.asObservable();
  readonly industry$ = this.ind$.asObservable();
  readonly entities$ = new BehaviorSubject<StudioEntity[]>([]);
  readonly runs$ = new BehaviorSubject<Run[]>([]);
  readonly bookings$ = new BehaviorSubject<Booking[]>([]);
  readonly kpis$ = new BehaviorSubject<Kpis>({ total: 0, qualified: 0, avgScore: 0, pendingBookings: 0, runs7d: 0, agentExec24h: 0, agentsActive: 0, agentsTotal: 0, handoffsPending: 0 });
  readonly agents$ = new BehaviorSubject<Agent[]>([]);
  readonly workflows$ = new BehaviorSubject<Workflow[]>([]);
  pendingThreadId?: string; pendingEntityId?: string;

  constructor() {
    const savedWs = localStorage.getItem('studio-ws');
    const savedInd = localStorage.getItem('studio-ind');
    this.loadConfig().subscribe(() => {
      if (savedWs) this.setWorkspace(savedWs as any);
      if (savedInd) this.setIndustry(savedInd);
      else if (this.workspace) this.setWorkspace(this.workspace.key as any);
      this.refreshAll();
    });
  }

  loadConfig(): Observable<StudioConfig> {
    return this.http.get<StudioConfig>(`${base}/config`).pipe(tap(cfg => {
      this.workspaces = cfg.workspaces.map(w => ({ key: w.key, label: w.label, description: w.description, icon: w.icon, routes: parse(w.routesJson), capabilities: parse(w.capabilitiesJson) }));
      this.industries = cfg.industries.map(i => ({ key: i.key, label: i.label, stages: parse(i.stagesJson), capabilities: parse(i.capabilitiesJson) }));
    }));
  }
  get workspaceList() { return this.workspaces; }
  get industryList() { return this.industries; }
  get workspace() { return this.ws$.value; }
  get industry() { return this.ind$.value; }

  setWorkspace(key: string) {
    const w = this.workspaces.find(x => x.key === key);
    if (w) { this.ws$.next(w); localStorage.setItem('studio-ws', key); }
  }
  setIndustry(key: string) {
    const i = this.industries.find(x => x.key === key) ?? this.industries[0];
    if (i) { this.ind$.next(i); localStorage.setItem('studio-ind', key); }
  }
  reset() { localStorage.removeItem('studio-ws'); localStorage.removeItem('studio-ind'); location.reload(); }

  refreshAll() {
    this.listKpis().subscribe({ error: () => {} });
    this.listRuns().subscribe({ error: () => {} });
    this.listBookings().subscribe({ error: () => {} });
    this.listAgents().subscribe({ error: () => {} });
    this.listWorkflows().subscribe({ error: () => {} });
    this.listEntitiesPaged(undefined, 1, 200).subscribe({ next: p => this.entities$.next(p.items), error: () => {} });
  }

  // ── entities ────────────────────────────────────────────────────
  listEntitiesPaged(classification?: string, page = 1, pageSize = 25): Observable<PagedResult<StudioEntity>> {
    const q = `?page=${page}&pageSize=${pageSize}${classification ? `&classification=${classification}` : ''}`;
    return this.http.get<PagedResult<StudioEntity>>(`${base}/entities${q}`);
  }
  getEntity(id: string): Observable<StudioEntity> { return this.http.get<StudioEntity>(`${base}/entities/${id}`); }
  createEntity(e: Partial<StudioEntity>): Observable<StudioEntity> { return this.http.post<StudioEntity>(`${base}/entities`, e).pipe(tap(() => this.refreshAll())); }
  updateEntity(id: string, e: Partial<StudioEntity>): Observable<StudioEntity> { return this.http.put<StudioEntity>(`${base}/entities/${id}`, e).pipe(tap(() => this.refreshAll())); }
  deleteEntity(id: string): Observable<void> { return this.http.delete<void>(`${base}/entities/${id}`); }
  moveStage(id: string, stage: string): Observable<void> {
    return this.http.put<void>(`${base}/entities/${id}/stage`, { stage }).pipe(tap(() => this.refreshAll()));
  }

  // ── discovery runs ──────────────────────────────────────────────
  runDiscovery(query: string, sources: string[], geography?: string, classification?: string, minScore?: number): Observable<Run> {
    return this.http.post<Run>(`${base}/runs`, { query, sources, geography, classification, minScore }).pipe(tap(r => this.runs$.next([r, ...this.runs$.value])));
  }
  listRuns(): Observable<Run[]> { return this.http.get<Run[]>(`${base}/runs`).pipe(tap(x => this.runs$.next(x))); }
  listKpis(): Observable<Kpis> { return this.http.get<Kpis>(`${base}/kpis`).pipe(tap(x => this.kpis$.next(x))); }
  listBookings(): Observable<Booking[]> { return this.http.get<Booking[]>(`${base}/bookings`).pipe(tap(x => this.bookings$.next(x))); }
  confirmBooking(id: string): Observable<void> { return this.http.post<void>(`${base}/bookings/${id}/confirm`, {}); }
  cancelBooking(id: string): Observable<void> { return this.http.post<void>(`${base}/bookings/${id}/cancel`, {}); }

  // ── conversations ───────────────────────────────────────────────
  listThreads(status?: string): Observable<ThreadPage> {
    return this.http.get<ThreadPage>(`${base}/threads${status ? `?status=${status}` : ''}`);
  }
  createThread(entityId: string | undefined, channel: string, subject: string): Observable<Thread> {
    return this.http.post<Thread>(`${base}/threads`, { entityId, channel, subject });
  }
  listMessages(threadId: string, limit = 50): Observable<MessagePage> {
    return this.http.get<MessagePage>(`${base}/threads/${threadId}/messages?limit=${limit}`);
  }
  postMessage(threadId: string, direction: string, body: string, isAi: boolean): Observable<Msg> {
    return this.http.post<Msg>(`${base}/threads/${threadId}/messages`, { direction, body, isAi });
  }
  closeThread(id: string): Observable<void> { return this.http.post<void>(`${base}/threads/${id}/close`, {}); }
  reopenThread(id: string): Observable<void> { return this.http.post<void>(`${base}/threads/${id}/reopen`, {}); }

  // ── agents / workflows / schedules ──────────────────────────────
  listAgents(): Observable<Agent[]> { return this.http.get<Agent[]>(`${base}/agents`).pipe(tap(x => this.agents$.next(x))); }
  createAgent(name: string, purpose: string, configJson = '{}'): Observable<Agent> { return this.http.post<Agent>(`${base}/agents`, { name, purpose, configJson }); }
  activateAgent(id: string): Observable<void> { return this.http.post<void>(`${base}/agents/${id}/activate`, {}); }
  pauseAgent(id: string): Observable<void> { return this.http.post<void>(`${base}/agents/${id}/pause`, {}); }
  runAgent(id: string, input: string): Observable<AgentRunRec> { return this.http.post<AgentRunRec>(`${base}/agents/${id}/run`, { input }); }
  listAgentRuns(agentId?: string): Observable<RunPage> { return this.http.get<RunPage>(`${base}/agent-runs${agentId ? `?agentId=${agentId}` : ''}`); }

  listWorkflows(): Observable<Workflow[]> { return this.http.get<Workflow[]>(`${base}/workflows`).pipe(tap(x => this.workflows$.next(x))); }
  createWorkflow(name: string, definitionJson = '{}'): Observable<Workflow> { return this.http.post<Workflow>(`${base}/workflows`, { name, definitionJson }); }
  updateWorkflow(id: string, name: string, definitionJson: string): Observable<Workflow> {
    return this.http.put<Workflow>(`${base}/workflows/${id}`, { name, definitionJson });
  }
  activateWorkflow(id: string): Observable<void> { return this.http.post<void>(`${base}/workflows/${id}/activate`, {}); }
  pauseWorkflow(id: string): Observable<void> { return this.http.post<void>(`${base}/workflows/${id}/pause`, {}); }
  executeWorkflow(id: string): Observable<Exec> { return this.http.post<Exec>(`${base}/workflows/${id}/execute`, {}); }
  listSchedules(): Observable<Schedule[]> { return this.http.get<Schedule[]>(`${base}/schedules`); }
  createSchedule(workflowId: string, cron: string): Observable<Schedule> { return this.http.post<Schedule>(`${base}/schedules`, { workflowId, cron }); }

  // ── campaigns / appointments ────────────────────────────────────
  listCampaigns(): Observable<Campaign[]> { return this.http.get<Campaign[]>(`${base}/campaigns`); }
  createCampaign(name: string, channel: string, scheduleJson?: string): Observable<Campaign> { return this.http.post<Campaign>(`${base}/campaigns`, { name, channel, scheduleJson }); }
  listAppointments(): Observable<ApptPage> { return this.http.get<ApptPage>(`${base}/appointments`); }
  createAppointment(entityId: string | undefined, startUtc: string, durationMinutes: number, notes?: string): Observable<Appt> {
    return this.http.post<Appt>(`${base}/appointments`, { entityId, startUtc, durationMinutes, notes });
  }
  cancelAppointment(id: string): Observable<void> { return this.http.post<void>(`${base}/appointments/${id}/cancel`, {}); }
  confirmAppointment(id: string): Observable<void> { return this.http.post<void>(`${base}/appointments/${id}/confirm`, {}); }

  // ── ops: jobs / hooks / providers / seed ────────────────────────
  listJobs(status?: string): Observable<JobPage> { return this.http.get<JobPage>(`${base}/jobs${status ? `?status=${status}` : ''}`); }
  retryJob(id: string): Observable<void> { return this.http.post<void>(`${base}/jobs/${id}/retry`, {}); }
  listExecutions(workflowId?: string): Observable<Exec[]> { return this.http.get<Exec[]>(`${base}/executions${workflowId ? `?workflowId=${workflowId}` : ''}`); }
  listHooks(): Observable<Hook[]> { return this.http.get<Hook[]>(`${base}/hooks`); }
  createHook(url: string, eventsJson: string): Observable<Hook> { return this.http.post<Hook>(`${base}/hooks`, { url, eventsJson }); }
  pingProvider(url: string): Observable<any> { return this.http.post(`${base}/providers/ping`, { url }); }
  seedDemo(force = false, workspace?: string): Observable<any> {
    return this.http.post(`${base}/seed-demo${workspace ? `?workspace=${workspace}` : ''}${force ? `${workspace ? '&' : '?'}force=true` : ''}`, {});
  }
  listAudit(): Observable<any[]> { return this.http.get<any[]>(`${base}/audit`); }

  // ── LLM providers / routing ─────────────────────────────────────
  listProviders(): Observable<any[]> { return this.http.get<any[]>(`${base}/llm/providers`); }
  listCredentials(): Observable<any[]> { return this.http.get<any[]>(`${base}/llm/credentials`); }
  saveCredential(providerKey: string, body: any): Observable<any> {
    return this.http.put(`${base}/llm/credentials/${providerKey}`, body);
  }
  deleteCredential(providerKey: string): Observable<void> { return this.http.delete<void>(`${base}/llm/credentials/${providerKey}`); }
  listRules(): Observable<any[]> { return this.http.get<any[]>(`${base}/llm/rules`); }
  saveRule(task: string, providerKey: string, minPriority = 0): Observable<any> { return this.http.put(`${base}/llm/rules/${task}`, { providerKey, minPriority }); }
  deleteRule(task: string): Observable<void> { return this.http.delete<void>(`${base}/llm/rules/${task}`); }
  testProvider(providerKey: string): Observable<any> { return this.http.post(`${base}/llm/test`, { providerKey }); }
  llmComplete(task: string, prompt: string): Observable<any> { return this.http.post(`${base}/llm/complete`, { task, prompt }); }
  llmAnalytics(): Observable<any> { return this.http.get(`${base}/llm/analytics`); }

  // ── voice / scoring / agency / backlog / presets ────────────────
  listVoiceCalls(): Observable<any[]> { return this.http.get<any[]>(`${base}/voice-calls`); }
  voiceFollowUp(id: string): Observable<{ threadId: string }> { return this.http.post<{ threadId: string }>(`${base}/voice-calls/${id}/follow-up`, {}); }
  getScoring(): Observable<{ gateThreshold: number; weights: any }> { return this.http.get<{ gateThreshold: number; weights: any }>(`${base}/scoring`); }
  putScoring(gateThreshold: number, weights: any): Observable<any> { return this.http.put(`${base}/scoring`, { gateThreshold, weights }); }
  listAgencyClients(): Observable<any[]> { return this.http.get<any[]>(`${base}/agency/clients`); }
  getBacklog(): Observable<{ headers: string[]; rows: any[]; count: number }> { return this.http.get<{ headers: string[]; rows: any[]; count: number }>(`${base}/backlog`); }
  listPresets(workspace?: string): Observable<any[]> { return this.http.get<any[]>(`${base}/presets${workspace ? `?workspace=${workspace}` : ''}`); }
  savePreset(name: string, query: any, workspace?: string): Observable<any> { return this.http.post(`${base}/presets`, { name, query, workspace }); }
  deletePreset(id: string): Observable<void> { return this.http.delete<void>(`${base}/presets/${id}`); }
  bulkEntities(ids: string[], stage?: string, agentId?: string): Observable<{ updated: number }> {
    return this.http.post<{ updated: number }>(`${base}/entities/bulk`, { ids, stage, agentId });
  }
  placeVoiceCall(entityId: string | undefined, contact: string, direction = 'outbound'): Observable<any> {
    return this.http.post(`${base}/voice/call`, { entityId, contact, direction });
  }

  // ── misc helpers used across screens ────────────────────────────
  listEntities(): Observable<StudioEntity[]> { return this.listEntitiesPaged(undefined, 1, 500).pipe(map(p => p.items)); }
  evidenceOf(e: StudioEntity): Evidence[] { return parse<Evidence[]>(e.evidenceJson); }
  setAgentStatus(id: string, action: 'activate' | 'pause'): Observable<void> {
    return action === 'activate' ? this.activateAgent(id) : this.pauseAgent(id);
  }
  setCampaignStatus(id: string, status: string): Observable<any> { return this.http.post(`${base}/campaigns/${id}/${status === 'active' ? 'pause' : 'activate'}`, {}); }
  toggleSchedule(id: string): Observable<any> { return this.http.post(`${base}/schedules/${id}/toggle`, {}); }
  deleteSchedule(id: string): Observable<void> { return this.http.delete<void>(`${base}/schedules/${id}`); }
  toggleHook(id: string): Observable<any> { return this.http.post(`${base}/hooks/${id}/toggle`, {}); }
  deleteHook(id: string): Observable<void> { return this.http.delete<void>(`${base}/hooks/${id}`); }
}
