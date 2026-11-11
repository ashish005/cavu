import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  LeadGenApiService,
  ClientBusiness,
  Campaign,
  CampaignMessage,
  CampaignReport,
  AiAgent,
  AgentExecution,
  AgentVersion,
  Appointment,
  AppointmentType,
  WorkflowDefinition,
  WorkflowRun,
  IntegrationProvider,
  IntegrationConnection,
  InboundEnquiry,
  InboundChannel,
  SubscriptionPlan,
  Subscription,
  Entitlements,
  AppNotification,
  AuditEntry,
  Lead,
  DuplicateCandidate,
  ProspectQuality,
  QualificationRule,
  QualificationEvaluation,
  AiMonitoringReport,
  DiscoveryResult,
  DiscoveryJob,
  VoiceInteraction,
  Prospect,
  ProspectEnrichment,
  ChannelPreference,
  SuppressionEntry,
  IngestionPolicy,
  IngestionAttempt
} from '../services/lead-gen-api.service';
import { WorkspaceContextService } from '../services/workspace-context.service';

type OpsTab = 'campaigns' | 'agents' | 'ai-monitor' | 'appointments' | 'workflows' | 'integrations' | 'inbound' | 'duplicates' | 'prospects' | 'discovery' | 'voice' | 'communication' | 'billing' | 'notifications' | 'audit';

@Component({
  selector: 'lead-gen-ops',
  templateUrl: './lead-gen-ops.component.html',
  styleUrls: ['./lead-gen-ops.component.scss'],
  standalone: false
})
export class LeadGenOpsComponent implements OnInit {
  activeTab: OpsTab = 'campaigns';
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  error = '';
  message = '';
  loading = false;

  campaigns: Campaign[] = [];
  campaignMessages: CampaignMessage[] = [];
  campaignReport?: CampaignReport;
  selectedCampaignId = '';
  leads: Lead[] = [];
  agents: AiAgent[] = [];
  agentVersions: AgentVersion[] = [];
  agentExecutions: AgentExecution[] = [];
  selectedAgent?: AiAgent;
  agentForm = { name: '', purpose: '' };
  runForm = { kind: 'qualification', input: '' };
  selectedAgentId = '';
  aiMonitoring?: AiMonitoringReport;
  aiMonitoringDays = 30;
  aiMonitoringLoading = false;
  appointments: Appointment[] = [];
  appointmentTypes: AppointmentType[] = [];
  workflows: WorkflowDefinition[] = [];
  workflowRuns: WorkflowRun[] = [];
  selectedWorkflowId = '';
  providers: IntegrationProvider[] = [];
  connections: IntegrationConnection[] = [];
  enquiries: InboundEnquiry[] = [];
  channels: InboundChannel[] = [];
  duplicates: DuplicateCandidate[] = [];
  plans: SubscriptionPlan[] = [];
  subscriptions: Subscription[] = [];
  entitlements?: Entitlements;
  notifications: AppNotification[] = [];
  auditEvents: AuditEntry[] = [];
  discoveryResults: DiscoveryResult[] = [];
  selectedJobId = '';
  voiceInteractions: VoiceInteraction[] = [];
  rules: QualificationRule[] = [];
  evaluations: QualificationEvaluation[] = [];
  selectedProspectId = '';
  quality?: ProspectQuality;
  jobs: DiscoveryJob[] = [];

  prospects: Prospect[] = [];
  enrichment?: ProspectEnrichment;
  ingestionPolicy?: IngestionPolicy;
  ingestionAttempts: IngestionAttempt[] = [];
  preferences: ChannelPreference[] = [];
  suppressions: SuppressionEntry[] = [];
  enrichEmail = '';
  enrichPhone = '';
  newSuppressionKey = '';
  newSuppressionReason = '';
  apptTypeId = '';
  apptAttendee = '';
  apptStart = '';
  wfName = '';
  wfTrigger = '{"type":"manual"}';
  wfConditions = '{}';
  wfActions = '[]';

  constructor(private readonly api: LeadGenApiService, private readonly workspaceContext: WorkspaceContextService) {}

  get tabGroups(): { label: string; tabs: { key: OpsTab; label: string }[] }[] {
    return [
      { label: 'Engage', tabs: [
        { key: 'campaigns', label: 'Campaigns' }, { key: 'inbound', label: 'Inbound' },
        { key: 'communication', label: 'Comms' }, { key: 'voice', label: 'Voice' } ] },
      { label: 'Schedule', tabs: [
        { key: 'appointments', label: 'Appointments' }, { key: 'workflows', label: 'Workflows' },
        { key: 'agents', label: 'Agents' }, { key: 'ai-monitor', label: 'AI Monitor' } ] },
      { label: 'Pipeline', tabs: [
        { key: 'prospects', label: 'Prospect Ops' }, { key: 'discovery', label: 'Discovery' },
        { key: 'duplicates', label: 'Duplicates' } ] },
      { label: 'System', tabs: [
        { key: 'integrations', label: 'Integrations' }, { key: 'billing', label: 'Billing' },
        { key: 'notifications', label: 'Notifications' }, { key: 'audit', label: 'Audit' } ] }
    ];
  }

  ngOnInit(): void {
    this.clientBusinessId = this.workspaceContext.current?.clientBusinessId ?? '';
    this.api.listClientBusinesses().subscribe({
      next: (bs) => {
        this.clientBusinesses = bs;
        if (!this.clientBusinessId && bs.length > 0) this.clientBusinessId = bs[0].id;
        this.loadForBusiness();
      },
      error: () => { if (this.clientBusinessId) this.loadForBusiness(); }
    });
    this.api.listIntegrationProviders().subscribe({ next: (p) => this.providers = p, error: () => undefined });
    this.api.listNotifications().subscribe({ next: (n) => this.notifications = n, error: () => undefined });
    this.api.listAuditEvents({ take: 100 }).subscribe({ next: (a) => this.auditEvents = a, error: () => undefined });
    this.api.listSubscriptionPlans().subscribe({ next: (p) => this.plans = p, error: () => undefined });
    this.api.listSubscriptions().subscribe({ next: (s) => this.subscriptions = s, error: () => undefined });
    this.api.getEntitlements().subscribe({ next: (e) => this.entitlements = e, error: () => undefined });
    this.loadForBusiness();
  }

  onBusinessChange(id: string): void {
    this.clientBusinessId = id;
    this.loadForBusiness();
    if (this.activeTab === 'ai-monitor') this.refreshAiMonitoring();
  }

  get hasBusiness(): boolean { return !!this.clientBusinessId; }

  setTab(tab: OpsTab): void {
    this.activeTab = tab;
    if (tab === 'ai-monitor') this.refreshAiMonitoring();
  }

  get aiProviderConnections(): IntegrationConnection[] {
    const aiProviderIds = new Set(this.providers.filter(provider => provider.kind === 'Ai').map(provider => provider.id));
    return this.connections.filter(connection => aiProviderIds.has(connection.providerId));
  }

  refreshAiMonitoring(): void {
    const clientBusinessId = this.cb();
    if (!clientBusinessId) return;
    const to = new Date();
    const from = new Date(to.getTime() - this.aiMonitoringDays * 24 * 60 * 60 * 1000);
    this.aiMonitoringLoading = true;
    this.error = '';
    this.api.getAiMonitoring(clientBusinessId, from.toISOString(), to.toISOString()).subscribe({
      next: report => {
        this.aiMonitoring = report;
        this.aiMonitoringLoading = false;
      },
      error: error => {
        this.error = this.err(error);
        this.aiMonitoringLoading = false;
      }
    });
  }

  private cb(): string | null {
    if (!this.clientBusinessId) { this.error = 'Select a client business first.'; return null; }
    return this.clientBusinessId;
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }

  loadForBusiness(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.api.listLeads(cb).subscribe({ next: (l) => this.leads = l, error: () => undefined });
    this.api.listCampaigns(cb).subscribe({ next: (c) => this.campaigns = c, error: () => undefined });
    this.api.listAgents(cb).subscribe({ next: (a) => this.agents = a, error: () => undefined });
    this.api.listAppointmentTypes(cb).subscribe({ next: (t) => this.appointmentTypes = t, error: () => undefined });
    this.api.listAppointments(cb).subscribe({ next: (a) => this.appointments = a, error: () => undefined });
    this.api.listWorkflows(cb).subscribe({ next: (w) => this.workflows = w, error: () => undefined });
    this.api.listIntegrationConnections(cb).subscribe({ next: (c) => this.connections = c, error: () => undefined });
    this.api.listInboundChannels(cb).subscribe({ next: (c) => this.channels = c, error: () => undefined });
    this.api.listInboundEnquiries(cb).subscribe({ next: (e) => this.enquiries = e, error: () => undefined });
    this.api.listDuplicateCandidates(cb).subscribe({ next: (d) => this.duplicates = d, error: () => undefined });
    this.api.listDiscoveryJobs(cb).subscribe({ next: (j) => this.jobs = j, error: () => undefined });
    this.api.listVoiceInteractions(cb).subscribe({ next: (v) => this.voiceInteractions = v, error: () => undefined });
    this.api.listQualificationRules(cb).subscribe({ next: (r) => this.rules = r, error: () => undefined });
    this.api.listChannelPreferences(cb).subscribe({ next: (p) => this.preferences = p, error: () => undefined });
    this.api.listSuppressions(cb).subscribe({ next: (x) => this.suppressions = x, error: () => undefined });
    this.api.getIngestionPolicy(cb).subscribe({ next: (p) => this.ingestionPolicy = p, error: (e) => { if (e.status !== 404) this.error = this.err(e); } });
    this.api.listIngestionAttempts(cb).subscribe({ next: (a) => this.ingestionAttempts = a, error: () => undefined });
    this.api.listProspects().subscribe({ next: (p) => this.prospects = p.items, error: () => undefined });
  }

  // campaigns
  selectCampaign(c: Campaign): void {
    this.selectedCampaignId = c.id;
    const cb = this.cb(); if (!cb) return;
    this.api.listCampaignMessages(cb, c.id).subscribe({ next: (m) => this.campaignMessages = m, error: (e) => this.error = this.err(e) });
    this.api.campaignReport(cb, c.id).subscribe({ next: (r) => this.campaignReport = r, error: () => undefined });
  }
  startCampaign(c: Campaign): void { const cb = this.cb(); if (cb) this.api.startCampaign(cb, c.id).subscribe({ next: () => this.loadForBusiness(), error: (e) => this.error = this.err(e) }); }
  pauseCampaign(c: Campaign): void { const cb = this.cb(); if (cb) this.api.pauseCampaign(cb, c.id).subscribe({ next: () => this.loadForBusiness(), error: (e) => this.error = this.err(e) }); }
  cancelCampaign(c: Campaign): void { const cb = this.cb(); if (cb) this.api.cancelCampaign(cb, c.id).subscribe({ next: () => this.loadForBusiness(), error: (e) => this.error = this.err(e) }); }
  dispatchCampaign(c: Campaign): void { const cb = this.cb(); if (cb) this.api.dispatchCampaign(cb, c.id).subscribe({ next: (d) => this.message = `Dispatched ${d.created}, skipped ${d.skipped}.`, error: (e) => this.error = this.err(e) }); }

  // agents
  selectAgent(a: AiAgent): void {
    this.selectedAgentId = a.id;
    this.selectedAgent = a;
    const cb = this.cb(); if (!cb) return;
    this.api.listAgentExecutions(cb, a.id).subscribe({ next: (x) => this.agentExecutions = x, error: () => undefined });
  }
  createAgent(): void {
    const cb = this.cb(); if (!cb || !this.agentForm.name.trim() || !this.agentForm.purpose.trim()) return;
    this.api.createAgent(cb, {
      name: this.agentForm.name.trim(), purpose: this.agentForm.purpose.trim(),
      behaviourJson: '{}', permissionsJson: '{"canSendEmail":false,"canUpdateLeads":false}'
    }).subscribe({
      next: (a) => { this.agentForm = { name: '', purpose: '' }; this.message = `Agent "${a.name}" created.`; this.loadForBusiness(); this.selectAgent(a); },
      error: (e) => this.error = this.err(e)
    });
  }
  activateAgent(a: AiAgent, versionId: string): void { const cb = this.cb(); if (cb) this.api.activateAgent(cb, a.id, versionId).subscribe({ next: () => this.loadForBusiness(), error: (e) => this.error = this.err(e) }); }

  // appointments
  cancelAppointment(a: Appointment): void { const cb = this.cb(); if (cb) this.api.cancelAppointment(cb, a.id).subscribe({ next: () => this.loadForBusiness(), error: (e) => this.error = this.err(e) }); }

  // workflows
  selectWorkflow(w: WorkflowDefinition): void {
    this.selectedWorkflowId = w.id;
    const cb = this.cb(); if (!cb) return;
    this.api.listWorkflowRuns(cb, w.id).subscribe({ next: (r) => this.workflowRuns = r, error: (e) => this.error = this.err(e) });
  }
  triggerWorkflow(w: WorkflowDefinition): void { const cb = this.cb(); if (cb) this.api.triggerWorkflow(cb, w.id).subscribe({ next: () => this.selectWorkflow(w), error: (e) => this.error = this.err(e) }); }

  // integrations
  checkConnection(c: IntegrationConnection): void { const cb = this.cb(); if (cb) this.api.checkIntegrationConnection(cb, c.id).subscribe({ next: () => this.loadForBusiness(), error: (e) => this.error = this.err(e) }); }

  // inbound
  convertEnquiry(e: InboundEnquiry): void { const cb = this.cb(); if (cb) this.api.convertInboundEnquiry(cb, e.id).subscribe({ next: () => this.loadForBusiness(), error: (err) => this.error = this.err(err) }); }

  // duplicates
  decideDuplicate(d: DuplicateCandidate, decision: string): void { const cb = this.cb(); if (cb) this.api.decideDuplicate(cb, d.id, decision).subscribe({ next: () => this.loadForBusiness(), error: (e) => this.error = this.err(e) }); }
  mergeDuplicate(d: DuplicateCandidate, survivor: string): void { const cb = this.cb(); if (cb) this.api.mergeDuplicate(cb, d.id, survivor).subscribe({ next: () => { this.message = 'Prospects merged.'; this.loadForBusiness(); }, error: (e) => this.error = this.err(e) }); }

  // billing
  createSubscription(planId: string): void { this.api.createSubscription(planId, 'Organization').subscribe({ next: () => { this.message = 'Subscription created.'; this.api.listSubscriptions().subscribe(s => this.subscriptions = s); }, error: (e) => this.error = this.err(e) }); }

  // prospect ops helpers
  selectJob(job: DiscoveryJob): void {
    this.selectedJobId = job.id;
    const cb = this.clientBusinessId;
    this.api.listDiscoveryResults(job.id).subscribe({ next: (r) => this.discoveryResults = r, error: () => undefined });
    if (cb) this.api.listProspects().subscribe({ next: (p) => { /* placeholder for prospect pick */ }, error: () => undefined });
  }
  executeJob(job: DiscoveryJob): void { this.api.executeDiscoveryJob(job.id).subscribe({ next: (x) => this.message = `Execution ${x.status}: ${x.newResults} new.`, error: (e) => this.error = this.err(e) }); }
  runAgent(a: AiAgent): void {
    const cb = this.cb(); if (!cb) return;
    this.api.runAgent(cb, a.id, this.runForm.kind, this.runForm.input || undefined).subscribe({
      next: (x) => {
        this.message = `Execution ${x.status}${x.outputSummary ? ' — ' + x.outputSummary : ''}${x.failureReason ? ' — ' + x.failureReason : ''}`;
        this.selectAgent(a);
      },
      error: (e) => this.error = this.err(e)
    });
  }
  assessProspect(prospectId: string): void {
    const cb = this.cb(); if (!cb || !prospectId) return;
    this.selectedProspectId = prospectId;
    this.api.qualifyProspect(cb, prospectId).subscribe({ next: (e) => this.evaluations = e, error: (err) => this.error = this.err(err) });
    this.api.getEnrichment(cb, prospectId).subscribe({ next: () => undefined, error: () => undefined });
    this.api.recalculateQuality(cb, prospectId).subscribe({ next: (q) => this.quality = q, error: () => undefined });
  }

  // ---------- prospect ops ----------
  selectProspect(p: Prospect): void {
    this.selectedProspectId = p.id;
    const cb = this.cb(); if (!cb) return;
    this.api.getEnrichment(cb, p.id).subscribe({ next: (e) => this.enrichment = e, error: (err) => this.error = this.err(err) });
    this.api.recalculateQuality(cb, p.id).subscribe({ next: (q) => this.quality = q, error: () => undefined });
    this.api.listEvaluations(cb, p.id).subscribe({ next: (e) => this.evaluations = e, error: () => undefined });
  }
  enrichProspect(): void {
    const cb = this.cb(); if (!cb || !this.selectedProspectId) return;
    this.api.enrichProspect(cb, this.selectedProspectId, { email: this.enrichEmail || undefined, phone: this.enrichPhone || undefined, source: 'manual' }).subscribe({
      next: () => { this.message = 'Enrichment recorded.'; this.selectProspect({ id: this.selectedProspectId } as Prospect); },
      error: (e) => this.error = this.err(e)
    });
  }
  qualifyProspect(): void {
    const cb = this.cb(); if (!cb || !this.selectedProspectId) return;
    this.api.qualifyProspect(cb, this.selectedProspectId).subscribe({ next: (e) => this.evaluations = e, error: (err) => this.error = this.err(err) });
  }
  ingestProspect(): void {
    const cb = this.cb(); if (!cb || !this.selectedProspectId) return;
    this.api.ingestProspect(cb, this.selectedProspectId).subscribe({ next: (a) => { this.message = `Ingestion: ${a.outcome}${a.reason ? ' — ' + a.reason : ''}`; this.loadForBusiness(); }, error: (e) => this.error = this.err(e) });
  }
  setIngestionMode(mode: string): void {
    const cb = this.cb(); if (!cb) return;
    this.api.setIngestionPolicy(cb, mode).subscribe({ next: (p) => this.ingestionPolicy = p, error: (e) => this.error = this.err(e) });
  }
  resolveField(fieldId: string): void {
    const cb = this.cb(); if (!cb) return;
    this.api.resolveEnrichmentField(cb, fieldId).subscribe({ next: () => this.selectProspect({ id: this.selectedProspectId } as Prospect), error: (e) => this.error = this.err(e) });
  }

  // ---------- communication ----------
  addSuppression(): void {
    const cb = this.cb(); if (!cb || !this.newSuppressionKey.trim() || !this.newSuppressionReason.trim()) return;
    this.api.addSuppression(cb, this.newSuppressionKey, this.newSuppressionReason).subscribe({
      next: (s) => { this.suppressions = [...this.suppressions, s]; this.newSuppressionKey = ''; this.newSuppressionReason = ''; },
      error: (e) => this.error = this.err(e)
    });
  }
  setSuppressionActive(s: SuppressionEntry, isActive: boolean): void {
    const cb = this.cb(); if (!cb) return;
    this.api.setSuppressionStatus(cb, s.id, isActive).subscribe({
      next: (u) => this.suppressions = this.suppressions.map(x => x.id === u.id ? u : x),
      error: (e) => this.error = this.err(e)
    });
  }
  setPreferenceOptOut(p: ChannelPreference, optedOut: boolean): void {
    const cb = this.cb(); if (!cb) return;
    this.api.setChannelPreference(cb, p.contactKey, p.channel, optedOut, p.source).subscribe({
      next: (u) => this.preferences = this.preferences.map(x => x.id === u.id ? u : x),
      error: (e) => this.error = this.err(e)
    });
  }
  checkEligibility(contactKey: string): void {
    const cb = this.cb(); if (!cb || !contactKey.trim()) return;
    this.api.checkCommunicationEligibility(cb, contactKey, 'Email').subscribe({
      next: (r) => this.message = `${contactKey}: ${r.eligibility} — ${r.reason}`,
      error: (e) => this.error = this.err(e)
    });
  }

  // ---------- appointments ----------
  bookAppointment(): void {
    const cb = this.cb(); if (!cb || !this.apptTypeId || !this.apptAttendee.trim() || !this.apptStart) return;
    this.api.createAppointment(cb, { appointmentTypeId: this.apptTypeId, attendeeName: this.apptAttendee, startAt: new Date(this.apptStart).toISOString() }).subscribe({
      next: () => { this.message = 'Appointment booked.'; this.apptAttendee = ''; this.apptStart = ''; this.loadForBusiness(); },
      error: (e) => this.error = this.err(e)
    });
  }
  sendReminder(a: Appointment): void {
    const cb = this.cb(); if (!cb) return;
    this.api.sendAppointmentReminder(cb, a.id).subscribe({ next: () => this.message = 'Reminder queued.', error: (e) => this.error = this.err(e) });
  }

  // ---------- workflows ----------
  createWorkflow(): void {
    const cb = this.cb(); if (!cb || !this.wfName.trim()) return;
    this.api.createWorkflow(cb, { name: this.wfName, triggerJson: this.wfTrigger, conditionsJson: this.wfConditions, actionsJson: this.wfActions, isActive: true }).subscribe({
      next: () => { this.message = 'Workflow created.'; this.wfName = ''; this.loadForBusiness(); },
      error: (e) => this.error = this.err(e)
    });
  }

  // ---------- voice ----------
  summarizeVoice(v: VoiceInteraction): void {
    const cb = this.cb(); if (!cb) return;
    const summary = window.prompt('Call summary:');
    if (!summary) return;
    this.api.recordVoiceSummary(cb, v.id, summary).subscribe({ next: () => this.loadForBusiness(), error: (e) => this.error = this.err(e) });
  }
  escalateVoice(v: VoiceInteraction): void {
    const cb = this.cb(); if (!cb) return;
    this.api.escalateVoiceInteraction(cb, v.id).subscribe({ next: () => this.loadForBusiness(), error: (e) => this.error = this.err(e) });
  }
}
