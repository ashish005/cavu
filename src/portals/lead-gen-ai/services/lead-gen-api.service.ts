import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@app-environments';
import { Observable } from 'rxjs';
import { AuthService } from '@app-third-party';
import { WorkspaceContextService } from './workspace-context.service';

// ---------- EP-01 ----------
export interface OrgMember { userId: string; role: string; isActive: boolean; assignedAt: string; revokedAt?: string; }
export interface OrgAuditEvent { id: string; actorUserId?: string; eventType: string; targetUserId?: string; previousRole?: string; newRole?: string; detail?: string; occurredAt: string; }
export interface PermissionsResponse { role: string; permissions: string[]; isOrganizationManager: boolean; }

// ---------- EP-03 ----------
export interface BusinessProfile { id: string; clientBusinessId: string; description?: string; industry?: string; category?: string; criteriaVersion: number; createdAt: string; updatedAt: string; }
export interface BusinessProfileRequest { description?: string; industry?: string; category?: string; }
export interface Offering { id: string; kind: string; name: string; description?: string; isActive: boolean; createdAt: string; }
export interface OfferingRequest { kind: string; name: string; description?: string; }
export interface TargetIndustry { id: string; industry: string; isActive: boolean; createdAt: string; }
export interface OperatingHour { dayOfWeek: string; isClosed: boolean; openMinute?: number; closeMinute?: number; }
export interface IndustryTemplate { key: string; name: string; description: string; suggestedQuestions: string[]; workflowHints: string[]; }

// ---------- EP-04 ----------
export interface UpdateProspectRequest { name: string; email?: string; phone?: string; website?: string; industry?: string; }
export interface ProspectContact { id: string; name: string; email?: string; phone?: string; title?: string; isPrimary: boolean; createdAt: string; }
export interface ProspectContactRequest { name: string; email?: string; phone?: string; title?: string; isPrimary: boolean; }

// ---------- EP-05 ----------
export interface DiscoverySource { id: string; name: string; provider: string; kind: string; isEnabled: boolean; requestsPerMinute?: number; capabilitiesJson: string; clientBusinessId?: string; }
export interface DiscoverySourceRequest { name: string; provider: string; kind: string; requestsPerMinute?: number; credentialReference?: string; capabilities?: string[]; }
export interface DiscoveryJob { id: string; name: string; type: string; clientBusinessId?: string; workspaceId?: string; isActive: boolean; criteriaVersion: number; createdAt: string; }
export interface DiscoveryJobRequest { name: string; type: string; clientBusinessId?: string; workspaceId?: string; geography?: string; industries?: string[]; categories?: string[]; keywords?: string[]; minimumEmployees?: number; maximumEmployees?: number; sourceIds?: string[]; }
export interface DiscoveryExecution { id: string; jobId: string; status: string; totalResults: number; newResults: number; duplicateResults: number; failedResults: number; error?: string; startedAt: string; completedAt?: string; }
export interface DiscoveryResult { id: string; executionId: string; jobId: string; clientBusinessId: string; type: string; name: string; sourceName: string; externalId?: string; status: string; prospectId?: string; createdAt: string; processedAt?: string; }

// ---------- EP-06/07/08/09 ----------
export interface EnrichRequest { email?: string; phone?: string; website?: string; industry?: string; summary?: string; source?: string; evidence?: string; }
export interface EnrichmentAttempt { id: string; prospectId: string; sourceName: string; status: string; failureReason?: string; startedAt: string; completedAt?: string; }
export interface EnrichmentField { id: string; fieldName: string; value: string; sourceName: string; kind: string; evidence?: string; confidence?: number; isResolved: boolean; createdAt: string; }
export interface ProspectEnrichment { prospectId: string; fields: EnrichmentField[]; conflictingFields: string[]; }
export interface DuplicateCandidate { id: string; prospectAId: string; prospectBId: string; matchingFieldsJson: string; evidenceJson?: string; decision: string; mergedIntoProspectId?: string; detectedAt: string; }
export interface MergeResult { survivorProspectId: string; mergedProspectId: string; status: string; }
export interface ProspectQuality { prospectId: string; status: string; missingFieldsJson: string; assessedAt?: string; }
export interface QualificationRule { id: string; name: string; prospectType: string; criteriaJson: string; version: number; isActive: boolean; createdAt: string; }
export interface QualificationRuleRequest { name: string; prospectType: string; criteriaJson?: string; isActive?: boolean; }
export interface QualificationEvaluation { id: string; ruleId: string; ruleVersion: number; kind: string; result: string; explanation?: string; effectiveResult: string; isOverridden: boolean; overrideReason?: string; providerMetadata?: string; evidenceJson?: string; evaluatedAt: string; }
export interface IngestionPolicy { id: string; mode: string; conditionsJson?: string; version: number; effectiveFrom: string; }
export interface IngestionAttempt { id: string; prospectId: string; policyVersion: number; outcome: string; reason?: string; leadId?: string; attemptedAt: string; }

// ---------- EP-10 ----------
export interface Lead { id: string; type: string; name: string; email?: string; phone?: string; website?: string; industry?: string; source: string; status: string; stageKey: string; ownerUserId?: string; clientBusinessId: string; workspaceId?: string; prospectId?: string; createdAt: string; updatedAt: string; archivedAt?: string; }
export interface LeadRequest { type: string; name: string; email?: string; phone?: string; website?: string; industry?: string; source?: string; workspaceId?: string; prospectId?: string; locationId?: string; }
export interface LeadActivity { id: string; leadId: string; kind: string; summary: string; detailsJson?: string; occurredAt: string; }
export interface LeadStage { id: string; key: string; label: string; sortOrder: number; isWon: boolean; isLost: boolean; }

// ---------- EP-11 ----------
export interface InboundChannel { id: string; kind: string; name: string; configurationJson?: string; isEnabled: boolean; createdAt: string; }
export interface InboundChannelRequest { kind: string; name: string; configurationJson?: string; isEnabled?: boolean; }
export interface InboundEnquiry { id: string; channelId: string; requesterName: string; requesterEmail?: string; requesterPhone?: string; message: string; status: string; matchedLeadId?: string; createdLeadId?: string; assignedUserId?: string; responseSummary?: string; receivedAt: string; respondedAt?: string; }
export interface InboundEnquiryRequest { channelId: string; requesterName: string; requesterEmail?: string; requesterPhone?: string; message: string; payloadJson?: string; }

// ---------- EP-12 ----------
export interface ChannelPreference { id: string; contactKey: string; channel: string; isOptedOut: boolean; source?: string; updatedAt: string; }
export interface SuppressionEntry { id: string; contactKey: string; channel?: string; reason: string; isActive: boolean; createdAt: string; }
export interface EligibilityResult { eligibility: string; reason: string; }

// ---------- EP-13 ----------
export interface Campaign { id: string; name: string; description?: string; channel: string; status: string; scheduledAt?: string; startedAt?: string; completedAt?: string; createdAt: string; }
export interface CampaignRequest { name: string; description?: string; channel: string; scheduledAt?: string; }
export interface CampaignStep { id: string; order: number; channel: string; templateKey: string; bodyTemplate?: string; delayMinutes: number; }
export interface CampaignStepRequest { order: number; channel: string; templateKey: string; bodyTemplate?: string; delayMinutes: number; }
export interface CampaignMessage { id: string; campaignId: string; leadId: string; status: string; approvedByUserId?: string; sentAt?: string; failureReason?: string; responseSummary?: string; stopRequested: boolean; }
export interface CampaignDispatch { campaignId: string; created: number; skipped: number; }
export interface CampaignReport { campaignId: string; totalMessages: number; sent: number; failed: number; pending: number; responses: number; stopRequested: number; }

// ---------- EP-14 ----------
export interface AiAgent { id: string; name: string; purpose: string; status: string; currentVersionId?: string; createdAt: string; updatedAt: string; }
export interface AiAgentRequest { name: string; purpose: string; behaviourJson: string; permissionsJson: string; }
export interface AgentVersion { id: string; agentId: string; version: number; behaviourJson: string; permissionsJson: string; createdAt: string; }
export interface AgentExecution { id: string; agentId: string; agentVersionId: string; kind: string; status: string; inputSummary?: string; outputSummary?: string; providerMetadata?: string; failureReason?: string; startedAt: string; completedAt?: string; }

// ---------- EP-15 ----------
export interface VoiceProviderConfig { id: string; providerName: string; credentialReference?: string; settingsJson?: string; isEnabled: boolean; updatedAt: string; }
export interface VoiceProviderRequest { providerName: string; credentialReference?: string; settingsJson?: string; isEnabled?: boolean; }
export interface VoiceInteraction { id: string; leadId?: string; direction: string; remoteParty?: string; providerCallId?: string; status: string; transcriptSummary?: string; recordingReference?: string; escalatedToUserId?: string; failureReason?: string; startedAt: string; endedAt?: string; }
export interface VoiceInteractionRequest { leadId?: string; direction: string; remoteParty?: string; providerCallId?: string; }

// ---------- EP-16 ----------
export interface AppointmentType { id: string; name: string; durationMinutes: number; description?: string; isActive: boolean; }
export interface AppointmentTypeRequest { name: string; durationMinutes: number; description?: string; isActive?: boolean; }
export interface Appointment { id: string; appointmentTypeId: string; leadId?: string; attendeeName: string; attendeeEmail?: string; attendeePhone?: string; startAt: string; endAt?: string; status: string; bookedByUserId: string; notes?: string; reminderSent: boolean; createdAt: string; }
export interface AppointmentRequest { appointmentTypeId: string; leadId?: string; attendeeName: string; attendeeEmail?: string; attendeePhone?: string; startAt: string; }

// ---------- EP-17 ----------
export interface WorkflowDefinition { id: string; name: string; triggerJson: string; conditionsJson: string; actionsJson: string; version: number; isActive: boolean; createdAt: string; }
export interface WorkflowRequest { name: string; triggerJson: string; conditionsJson: string; actionsJson: string; isActive?: boolean; }
export interface WorkflowRun { id: string; workflowId: string; workflowVersion: number; triggerKind: string; status: string; attemptCount: number; resultJson?: string; error?: string; startedAt: string; completedAt?: string; }

// ---------- EP-18 ----------
export interface IntegrationProvider { id: string; key: string; displayName: string; kind: string; capabilitiesJson: string; documentationUrl?: string; isEnabled: boolean; createdAt: string; }
export interface IntegrationConnection { id: string; clientBusinessId: string; providerId: string; providerKey?: string; credentialReference?: string; settingsJson?: string; status: string; lastError?: string; lastCheckedAt?: string; createdAt: string; }
export interface IntegrationConnectionRequest { providerId: string; credentialReference?: string; settingsJson?: string; }

// ---------- EP-19/30 ----------
export interface SummaryReport { prospects: number; leads: number; campaigns: number; appointments: number; discoveryExecutions: number; }
export interface FunnelReport { prospects: number; qualified: number; ingested: number; leads: number; won: number; }
export interface AiUsageReport { agentExecutions: number; agentFailures: number; aiEvaluations: number; }
export interface AiMonitoringEvent {
  kind: string;
  id: string;
  operation: string;
  provider: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  latencyMs?: number;
  inputSummary?: string;
  resultSummary?: string;
  error?: string;
  httpStatusCode?: number;
}
export interface AiMonitoringReport {
  from: string;
  to: string;
  agentExecutions: number;
  agentSucceeded: number;
  agentFailed: number;
  agentRunning: number;
  stubAgentExecutions: number;
  aiEvaluations: number;
  aiEvaluationsSatisfied: number;
  aiEvaluationsFailed: number;
  aiEvaluationsUnavailable: number;
  aiProviderExecutions: number;
  aiProviderFailures: number;
  averageAiProviderLatencyMs?: number;
  recentEvents: AiMonitoringEvent[];
}
export interface DomainReport { domain: string; primaryCount?: number; secondaryCount?: number; tertiaryCount?: number; quaternaryCount?: number; supplementaryCount?: number; }

// ---------- EP-20 ----------
export interface SubscriptionPlan { id: string; key: string; displayName: string; limitsJson: string; monthlyPrice?: number; currency?: string; isActive: boolean; }
export interface Subscription { id: string; planId: string; organizationId: string; scope: string; clientBusinessId?: string; status: string; currentPeriodEnd?: string; createdAt: string; }
export interface Entitlements { subscription?: Subscription; planKey?: string; planName?: string; limitsJson?: string; usage: { metric: string; total: number }[]; }

// ---------- EP-21..27 ----------
export interface CandidateProfile { id: string; displayName: string; headline?: string; summary?: string; location?: string; phone?: string; email?: string; visibility: string; createdAt: string; }
export interface CandidateProfileRequest { displayName: string; headline?: string; summary?: string; location?: string; phone?: string; email?: string; visibility?: string; }
export interface CandidatePreferences { id: string; targetRolesJson: string; industriesJson: string; locationsJson: string; workArrangement?: string; minCompensation?: number; currency?: string; updatedAt: string; }
export interface CandidatePreferencesRequest { targetRolesJson?: string; industriesJson?: string; locationsJson?: string; workArrangement?: string; minCompensation?: number; currency?: string; }
export interface Resume { id: string; fileName: string; contentType: string; status: string; createdAt: string; }
export interface ResumeRequest { fileName: string; storageReference: string; contentType?: string; }
export interface JobListing { id: string; jobSourceId?: string; title: string; company?: string; location?: string; description?: string; externalId?: string; requirementsJson?: string; compensationJson?: string; workArrangement?: string; status: string; isSaved: boolean; firstSeenAt: string; lastSeenAt: string; expiredAt?: string; }
export interface JobListingRequest { jobSourceId?: string; title: string; company?: string; location?: string; description?: string; externalId?: string; requirementsJson?: string; compensationJson?: string; workArrangement?: string; }
export interface JobMatchAssessment { id: string; jobListingId: string; assessment: string; explanation: string; supportingFactorsJson: string; limitationsJson: string; resumeVersionId?: string; modelMetadata?: string; assessedAt: string; }
export interface JobAlert { id: string; name: string; criteriaJson: string; frequency: string; status: string; lastRunAt?: string; createdAt: string; }
export interface JobAlertRequest { name: string; criteriaJson: string; frequency: string; }
export interface JobApplication { id: string; jobListingId: string; stage: string; appliedAt?: string; notes?: string; outcome?: string; compensationOffered?: string; isExternal: boolean; createdAt: string; updatedAt: string; }
export interface JobApplicationRequest { jobListingId: string; notes?: string; isExternal: boolean; }

export interface JobSource { id: string; name: string; kind: string; configurationJson?: string; isEnabled: boolean; createdAt: string; }
export interface JobSourceRequest { name: string; kind: string; configurationJson?: string; isEnabled?: boolean; }
export interface ResumeVersion { id: string; resumeId: string; version: number; extractedJson?: string; reviewedJson?: string; isConfirmed: boolean; createdAt: string; }

// ---------- EP-28/29 ----------
export interface AppNotification { id: string; recipientUserId?: string; clientBusinessId?: string; kind: string; subject: string; body: string; channel: string; status: string; scheduledFor?: string; sentAt?: string; failureReason?: string; createdAt: string; }
export interface AuditEntry { id: string; actorUserId?: string; entityType: string; entityId: string; action: string; clientBusinessId?: string; detailJson?: string; occurredAt: string; }

export type ProspectType = 'B2B' | 'B2C';

export interface Prospect {
  id: string;
  type: ProspectType;
  name: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  industry?: string | null;
  source: string;
  createdAt: string;
  locationId?: string | null;
}

export interface ProspectList {
  items: Prospect[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface PossibleDuplicateProspect extends Prospect {
  matchingIdentifiers: string[];
}

export interface ProspectDuplicateConflict {
  message: string;
  matches: PossibleDuplicateProspect[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  defaultTimeZoneId: string;
  isOwner: boolean;
  canManage: boolean;
  createdAt: string;
}

export interface OrganizationRequest {
  name: string;
  slug: string;
  defaultTimeZoneId: string;
}

export type ClientBusinessRole = 'Viewer' | 'Editor' | 'ClientAdmin';

export interface ClientBusiness {
  id: string;
  ownerAgencyId: string;
  ownerUserId: string;
  name: string;
  slug: string;
  countryCode: string;
  defaultTimeZoneId: string;
  status: 'Draft' | 'Onboarding' | 'Active' | 'Suspended' | 'Inactive';
  createdAt: string;
  updatedAt?: string | null;
  currentUserRole: ClientBusinessRole | null;
  canManage: boolean;
}

export interface CreateClientBusinessRequest {
  name: string;
  slug: string;
  countryCode: string;
  defaultTimeZoneId: string;
}

export interface ClientBusinessUser {
  userId: string;
  role: ClientBusinessRole;
  assignedAt: string;
}

export interface ClientBusinessInvitation {
  id: string;
  email: string;
  role: ClientBusinessRole;
  status: 'Pending' | 'Accepted' | 'Revoked' | 'Expired';
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string | null;
  deliveryJobId?: string | null;
}

export interface CreateClientBusinessInvitationRequest {
  email: string;
  role: ClientBusinessRole;
}

export interface WorkspaceClient {
  id: string;
  name: string;
}

export interface Workspace {
  id: string;
  name: string;
  timeZoneId: string;
  requiresClientSelection: boolean;
  clientBusinesses: WorkspaceClient[];
}

export interface CreateWorkspaceRequest {
  name: string;
  timeZoneId: string;
  clientBusinessIds: string[];
}

export interface ClientBusinessReportRow {
  clientBusinessId: string;
  clientBusinessName: string;
  totalProspects: number;
  b2BProspects: number;
  b2CProspects: number;
}

export interface ClientBusinessReport {
  from: string;
  to: string;
  branchId: string;
  totalProspects: number;
  b2BProspects: number;
  b2CProspects: number;
  clients: ClientBusinessReportRow[];
}

export interface ClientBusinessLocation {
  id: string;
  clientBusinessId: string;
  name: string;
  code?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  region?: string | null;
  postalCode?: string | null;
  countryCode: string;
  timeZoneId: string;
  operatingHours?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ClientBusinessLocationRequest {
  name: string;
  code?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  countryCode: string;
  timeZoneId: string;
  operatingHours?: string;
}

export interface CreateProspectRequest {
  type: ProspectType;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  locationId?: string;
  confirmPossibleDuplicates?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LeadGenApiService {
  private readonly baseUrl = environment.leadUrl.replace(/\/$/, '');

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
    private readonly workspaceContext: WorkspaceContextService
  ) {}

  checkReadiness(): Observable<string> {
    return this.http.get(`${this.baseUrl}/health/ready`, { responseType: 'text' });
  }

  getOpenApiUrl(): string {
    return `${this.baseUrl}/openapi/v1.json`;
  }

  getOrganization(): Observable<Organization> {
    return this.http.get<Organization>(`${this.baseUrl}/api/v1/organization`, {
      headers: this.authorizationHeaders()
    });
  }

  createOrganization(request: OrganizationRequest): Observable<Organization> {
    return this.http.post<Organization>(`${this.baseUrl}/api/v1/organization`, request, {
      headers: this.authorizationHeaders()
    });
  }

  updateOrganization(request: OrganizationRequest): Observable<Organization> {
    return this.http.put<Organization>(`${this.baseUrl}/api/v1/organization`, request, {
      headers: this.authorizationHeaders()
    });
  }

  deactivateOrganization(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/v1/organization/deactivate`, {}, {
      headers: this.authorizationHeaders()
    });
  }

  listClientBusinesses(): Observable<ClientBusiness[]> {
    return this.http.get<ClientBusiness[]>(`${this.baseUrl}/api/v1/client-businesses`, {
      headers: this.authorizationHeaders()
    });
  }

  createClientBusiness(request: CreateClientBusinessRequest): Observable<ClientBusiness> {
    return this.http.post<ClientBusiness>(`${this.baseUrl}/api/v1/client-businesses`, request, {
      headers: this.authorizationHeaders()
    });
  }

  listClientBusinessUsers(clientBusinessId: string): Observable<ClientBusinessUser[]> {
    return this.http.get<ClientBusinessUser[]>(`${this.baseUrl}/api/v1/client-businesses/${encodeURIComponent(clientBusinessId)}/users`, {
      headers: this.authorizationHeaders()
    });
  }

  assignClientBusinessUser(clientBusinessId: string, userId: string, role: ClientBusinessRole): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/api/v1/client-businesses/${encodeURIComponent(clientBusinessId)}/users/${encodeURIComponent(userId)}`,
      { role },
      { headers: this.authorizationHeaders() }
    );
  }

  revokeClientBusinessUser(clientBusinessId: string, userId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/v1/client-businesses/${encodeURIComponent(clientBusinessId)}/users/${encodeURIComponent(userId)}`,
      { headers: this.authorizationHeaders() }
    );
  }

  listClientBusinessInvitations(clientBusinessId: string): Observable<ClientBusinessInvitation[]> {
    return this.http.get<ClientBusinessInvitation[]>(
      `${this.baseUrl}/api/v1/client-businesses/${encodeURIComponent(clientBusinessId)}/invitations`,
      { headers: this.authorizationHeaders() }
    );
  }

  inviteClientBusinessUser(
    clientBusinessId: string,
    request: CreateClientBusinessInvitationRequest
  ): Observable<ClientBusinessInvitation> {
    return this.http.post<ClientBusinessInvitation>(
      `${this.baseUrl}/api/v1/client-businesses/${encodeURIComponent(clientBusinessId)}/invitations`,
      request,
      { headers: this.authorizationHeaders() }
    );
  }

  revokeClientBusinessInvitation(clientBusinessId: string, invitationId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/v1/client-businesses/${encodeURIComponent(clientBusinessId)}/invitations/${encodeURIComponent(invitationId)}`,
      { headers: this.authorizationHeaders() }
    );
  }

  acceptClientBusinessInvitation(token: string): Observable<{
    clientBusinessId: string;
    clientBusinessName: string;
    role: ClientBusinessRole;
  }> {
    return this.http.post<{
      clientBusinessId: string;
      clientBusinessName: string;
      role: ClientBusinessRole;
    }>(`${this.baseUrl}/api/v1/client-business-invitations/accept`, { token }, {
      headers: this.authorizationHeaders()
    });
  }

  listWorkspaces(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${this.baseUrl}/api/v1/workspaces`, {
      headers: this.authorizationHeaders()
    });
  }

  createWorkspace(request: CreateWorkspaceRequest): Observable<Workspace> {
    return this.http.post<Workspace>(`${this.baseUrl}/api/v1/workspaces`, request, {
      headers: this.authorizationHeaders()
    });
  }

  listClientBusinessLocations(clientBusinessId: string): Observable<ClientBusinessLocation[]> {
    return this.http.get<ClientBusinessLocation[]>(
      `${this.baseUrl}/api/v1/client-businesses/${encodeURIComponent(clientBusinessId)}/locations`,
      { headers: this.authorizationHeaders() }
    );
  }

  createClientBusinessLocation(
    clientBusinessId: string,
    request: ClientBusinessLocationRequest
  ): Observable<ClientBusinessLocation> {
    return this.http.post<ClientBusinessLocation>(
      `${this.baseUrl}/api/v1/client-businesses/${encodeURIComponent(clientBusinessId)}/locations`,
      request,
      { headers: this.authorizationHeaders() }
    );
  }

  updateClientBusinessLocation(
    clientBusinessId: string,
    locationId: string,
    request: ClientBusinessLocationRequest
  ): Observable<ClientBusinessLocation> {
    return this.http.put<ClientBusinessLocation>(
      `${this.baseUrl}/api/v1/client-businesses/${encodeURIComponent(clientBusinessId)}/locations/${encodeURIComponent(locationId)}`,
      request,
      { headers: this.authorizationHeaders() }
    );
  }

  setClientBusinessLocationActive(
    clientBusinessId: string,
    locationId: string,
    isActive: boolean
  ): Observable<ClientBusinessLocation> {
    return this.http.put<ClientBusinessLocation>(
      `${this.baseUrl}/api/v1/client-businesses/${encodeURIComponent(clientBusinessId)}/locations/${encodeURIComponent(locationId)}/status`,
      { isActive },
      { headers: this.authorizationHeaders() }
    );
  }

  getClientBusinessReport(clientBusinessId?: string): Observable<ClientBusinessReport> {
    let params = new HttpParams();
    if (clientBusinessId) {
      params = params.set('clientBusinessId', clientBusinessId);
    }

    return this.http.get<ClientBusinessReport>(`${this.baseUrl}/api/v1/reports/client-businesses`, {
      headers: this.authorizationHeaders(),
      params
    });
  }

  listProspects(): Observable<ProspectList> {
    let params = new HttpParams().set('page', 1).set('pageSize', 50);
    const context = this.workspaceContext.current;
    if (context) {
      params = params.set('workspaceId', context.workspaceId).set('clientBusinessId', context.clientBusinessId);
    }

    return this.http.get<ProspectList>(`${this.baseUrl}/api/v1/prospects`, {
      headers: this.authorizationHeaders(),
      params
    });
  }

  createProspect(request: CreateProspectRequest): Observable<Prospect> {
    const context = this.workspaceContext.current;
    return this.http.post<Prospect>(`${this.baseUrl}/api/v1/prospects`, {
      ...request,
      workspaceId: context?.workspaceId,
      clientBusinessId: context?.clientBusinessId
    }, {
      headers: this.authorizationHeaders()
    });
  }

  // ---------- EP-01 organization members ----------
  listOrganizationMembers(): Observable<OrgMember[]> {
    return this.http.get<OrgMember[]>(`${this.baseUrl}/api/v1/organization/members`, { headers: this.authorizationHeaders() });
  }
  assignOrganizationMember(userId: string, role: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/api/v1/organization/members/${userId}`, { role }, { headers: this.authorizationHeaders() });
  }
  revokeOrganizationMember(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/v1/organization/members/${userId}`, { headers: this.authorizationHeaders() });
  }
  listOrganizationAuditEvents(take = 100): Observable<OrgAuditEvent[]> {
    return this.http.get<OrgAuditEvent[]>(`${this.baseUrl}/api/v1/organization/audit-events`, { headers: this.authorizationHeaders(), params: new HttpParams().set('take', take) });
  }
  getPermissions(): Observable<PermissionsResponse> {
    return this.http.get<PermissionsResponse>(`${this.baseUrl}/api/v1/organization/permissions`, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-03 business configuration ----------
  getBusinessProfile(clientBusinessId: string): Observable<BusinessProfile> {
    return this.http.get<BusinessProfile>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/profile`, { headers: this.authorizationHeaders() });
  }
  updateBusinessProfile(clientBusinessId: string, request: BusinessProfileRequest): Observable<BusinessProfile> {
    return this.http.put<BusinessProfile>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/profile`, request, { headers: this.authorizationHeaders() });
  }
  listOfferings(clientBusinessId: string): Observable<Offering[]> {
    return this.http.get<Offering[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/offerings`, { headers: this.authorizationHeaders() });
  }
  createOffering(clientBusinessId: string, request: OfferingRequest): Observable<Offering> {
    return this.http.post<Offering>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/offerings`, request, { headers: this.authorizationHeaders() });
  }
  updateOffering(clientBusinessId: string, offeringId: string, request: OfferingRequest): Observable<Offering> {
    return this.http.put<Offering>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/offerings/${offeringId}`, request, { headers: this.authorizationHeaders() });
  }
  setOfferingStatus(clientBusinessId: string, offeringId: string, isActive: boolean): Observable<Offering> {
    return this.http.put<Offering>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/offerings/${offeringId}/status`, { isActive }, { headers: this.authorizationHeaders() });
  }
  listTargetIndustries(clientBusinessId: string): Observable<TargetIndustry[]> {
    return this.http.get<TargetIndustry[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/target-industries`, { headers: this.authorizationHeaders() });
  }
  addTargetIndustry(clientBusinessId: string, industry: string): Observable<TargetIndustry> {
    return this.http.post<TargetIndustry>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/target-industries`, { industry }, { headers: this.authorizationHeaders() });
  }
  removeTargetIndustry(clientBusinessId: string, industryId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/target-industries/${industryId}`, { headers: this.authorizationHeaders() });
  }
  listOperatingHours(clientBusinessId: string): Observable<OperatingHour[]> {
    return this.http.get<OperatingHour[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/operating-hours`, { headers: this.authorizationHeaders() });
  }
  setOperatingHour(clientBusinessId: string, dayOfWeek: string, isClosed: boolean, openMinute?: number, closeMinute?: number): Observable<OperatingHour[]> {
    return this.http.put<OperatingHour[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/operating-hours`, { dayOfWeek, isClosed, openMinute, closeMinute }, { headers: this.authorizationHeaders() });
  }
  listIndustryTemplates(clientBusinessId: string): Observable<IndustryTemplate[]> {
    return this.http.get<IndustryTemplate[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/templates`, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-04 prospect contacts ----------
  updateProspect(prospectId: string, request: UpdateProspectRequest): Observable<Prospect> {
    return this.http.put<Prospect>(`${this.baseUrl}/api/v1/prospects/${prospectId}`, request, { headers: this.authorizationHeaders() });
  }
  listProspectContacts(prospectId: string): Observable<ProspectContact[]> {
    return this.http.get<ProspectContact[]>(`${this.baseUrl}/api/v1/prospects/${prospectId}/contacts`, { headers: this.authorizationHeaders() });
  }
  createProspectContact(prospectId: string, request: ProspectContactRequest): Observable<ProspectContact> {
    return this.http.post<ProspectContact>(`${this.baseUrl}/api/v1/prospects/${prospectId}/contacts`, request, { headers: this.authorizationHeaders() });
  }
  deleteProspectContact(prospectId: string, contactId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/v1/prospects/${prospectId}/contacts/${contactId}`, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-05 discovery ----------
  listDiscoverySources(): Observable<DiscoverySource[]> {
    return this.http.get<DiscoverySource[]>(`${this.baseUrl}/api/v1/discovery-sources`, { headers: this.authorizationHeaders() });
  }
  createDiscoverySource(request: DiscoverySourceRequest): Observable<DiscoverySource> {
    return this.http.post<DiscoverySource>(`${this.baseUrl}/api/v1/discovery-sources`, request, { headers: this.authorizationHeaders() });
  }
  setDiscoverySourceStatus(id: string, isActive: boolean): Observable<DiscoverySource> {
    return this.http.put<DiscoverySource>(`${this.baseUrl}/api/v1/discovery-sources/${id}/status`, { isActive }, { headers: this.authorizationHeaders() });
  }
  listDiscoveryJobs(clientBusinessId?: string): Observable<DiscoveryJob[]> {
    let params = new HttpParams();
    if (clientBusinessId) params = params.set('clientBusinessId', clientBusinessId);
    return this.http.get<DiscoveryJob[]>(`${this.baseUrl}/api/v1/discovery-jobs`, { headers: this.authorizationHeaders(), params });
  }
  createDiscoveryJob(request: DiscoveryJobRequest): Observable<DiscoveryJob> {
    return this.http.post<DiscoveryJob>(`${this.baseUrl}/api/v1/discovery-jobs`, request, { headers: this.authorizationHeaders() });
  }
  executeDiscoveryJob(id: string): Observable<DiscoveryExecution> {
    return this.http.post<DiscoveryExecution>(`${this.baseUrl}/api/v1/discovery-jobs/${id}/execute`, {}, { headers: this.authorizationHeaders() });
  }
  listDiscoveryResults(jobId: string): Observable<DiscoveryResult[]> {
    return this.http.get<DiscoveryResult[]>(`${this.baseUrl}/api/v1/discovery-jobs/${jobId}/results`, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-06/07/08/09 prospect operations ----------
  enrichProspect(clientBusinessId: string, prospectId: string, request: EnrichRequest): Observable<EnrichmentAttempt> {
    return this.http.post<EnrichmentAttempt>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/prospects/${prospectId}/enrich`, request, { headers: this.authorizationHeaders() });
  }
  getEnrichment(clientBusinessId: string, prospectId: string): Observable<ProspectEnrichment> {
    return this.http.get<ProspectEnrichment>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/prospects/${prospectId}/enrichment`, { headers: this.authorizationHeaders() });
  }
  listDuplicateCandidates(clientBusinessId: string, decision?: string): Observable<DuplicateCandidate[]> {
    let params = new HttpParams();
    if (decision) params = params.set('decision', decision);
    return this.http.get<DuplicateCandidate[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/duplicate-candidates`, { headers: this.authorizationHeaders(), params });
  }
  decideDuplicate(clientBusinessId: string, id: string, decision: string): Observable<DuplicateCandidate> {
    return this.http.post<DuplicateCandidate>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/duplicate-candidates/${id}/decision`, { decision }, { headers: this.authorizationHeaders() });
  }
  mergeDuplicate(clientBusinessId: string, id: string, survivorProspectId: string): Observable<MergeResult> {
    return this.http.post<MergeResult>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/duplicate-candidates/${id}/merge`, { survivorProspectId }, { headers: this.authorizationHeaders() });
  }
  recalculateQuality(clientBusinessId: string, prospectId: string): Observable<ProspectQuality> {
    return this.http.post<ProspectQuality>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/prospects/${prospectId}/quality/recalculate`, {}, { headers: this.authorizationHeaders() });
  }
  listQualificationRules(clientBusinessId: string): Observable<QualificationRule[]> {
    return this.http.get<QualificationRule[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/qualification-rules`, { headers: this.authorizationHeaders() });
  }
  createQualificationRule(clientBusinessId: string, request: QualificationRuleRequest): Observable<QualificationRule> {
    return this.http.post<QualificationRule>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/qualification-rules`, request, { headers: this.authorizationHeaders() });
  }
  qualifyProspect(clientBusinessId: string, prospectId: string, kind?: string): Observable<QualificationEvaluation[]> {
    return this.http.post<QualificationEvaluation[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/prospects/${prospectId}/qualify`, { kind }, { headers: this.authorizationHeaders() });
  }
  listEvaluations(clientBusinessId: string, prospectId: string): Observable<QualificationEvaluation[]> {
    return this.http.get<QualificationEvaluation[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/prospects/${prospectId}/evaluations`, { headers: this.authorizationHeaders() });
  }
  getIngestionPolicy(clientBusinessId: string): Observable<IngestionPolicy> {
    return this.http.get<IngestionPolicy>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/ingestion-policy`, { headers: this.authorizationHeaders() });
  }
  setIngestionPolicy(clientBusinessId: string, mode: string, conditionsJson?: string): Observable<IngestionPolicy> {
    return this.http.put<IngestionPolicy>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/ingestion-policy`, { mode, conditionsJson }, { headers: this.authorizationHeaders() });
  }
  ingestProspect(clientBusinessId: string, prospectId: string): Observable<IngestionAttempt> {
    return this.http.post<IngestionAttempt>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/prospects/${prospectId}/ingest`, {}, { headers: this.authorizationHeaders() });
  }
  listIngestionAttempts(clientBusinessId: string, prospectId?: string): Observable<IngestionAttempt[]> {
    let params = new HttpParams();
    if (prospectId) params = params.set('prospectId', prospectId);
    return this.http.get<IngestionAttempt[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/ingestion-attempts`, { headers: this.authorizationHeaders(), params });
  }
  resolveEnrichmentField(clientBusinessId: string, fieldId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/enrichment-fields/${fieldId}/resolve`, {}, { headers: this.authorizationHeaders() });
  }
  setSuppressionStatus(clientBusinessId: string, entryId: string, isActive: boolean): Observable<SuppressionEntry> {
    return this.http.put<SuppressionEntry>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/communication/suppression/${entryId}/status`, { isActive }, { headers: this.authorizationHeaders() });
  }
  sendAppointmentReminder(clientBusinessId: string, id: string): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/appointments/${id}/reminder`, {}, { headers: this.authorizationHeaders() });
  }
  escalateVoiceInteraction(clientBusinessId: string, id: string): Observable<VoiceInteraction> {
    return this.http.post<VoiceInteraction>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/voice/interactions/${id}/escalate`, {}, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-10 leads ----------
  listLeads(clientBusinessId: string, filters?: { status?: string; stage?: string; search?: string }): Observable<Lead[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.stage) params = params.set('stage', filters.stage);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<Lead[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/leads`, { headers: this.authorizationHeaders(), params });
  }
  createLead(clientBusinessId: string, request: LeadRequest): Observable<Lead> {
    return this.http.post<Lead>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/leads`, request, { headers: this.authorizationHeaders() });
  }
  updateLead(clientBusinessId: string, leadId: string, request: LeadRequest): Observable<Lead> {
    return this.http.put<Lead>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/leads/${leadId}`, request, { headers: this.authorizationHeaders() });
  }
  setLeadStage(clientBusinessId: string, leadId: string, stageKey: string): Observable<Lead> {
    return this.http.post<Lead>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/leads/${leadId}/stage`, { stageKey }, { headers: this.authorizationHeaders() });
  }
  archiveLead(clientBusinessId: string, leadId: string): Observable<Lead> {
    return this.http.post<Lead>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/leads/${leadId}/archive`, {}, { headers: this.authorizationHeaders() });
  }
  restoreLead(clientBusinessId: string, leadId: string): Observable<Lead> {
    return this.http.post<Lead>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/leads/${leadId}/restore`, {}, { headers: this.authorizationHeaders() });
  }
  convertLead(clientBusinessId: string, leadId: string): Observable<Lead> {
    return this.http.post<Lead>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/leads/${leadId}/convert`, {}, { headers: this.authorizationHeaders() });
  }
  listLeadActivities(clientBusinessId: string, leadId: string): Observable<LeadActivity[]> {
    return this.http.get<LeadActivity[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/leads/${leadId}/activities`, { headers: this.authorizationHeaders() });
  }
  addLeadActivity(clientBusinessId: string, leadId: string, kind: string, summary: string): Observable<LeadActivity> {
    return this.http.post<LeadActivity>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/leads/${leadId}/activities`, { kind, summary }, { headers: this.authorizationHeaders() });
  }
  listLeadStages(clientBusinessId: string): Observable<LeadStage[]> {
    return this.http.get<LeadStage[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/lead-stages`, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-11 inbound ----------
  listInboundChannels(clientBusinessId: string): Observable<InboundChannel[]> {
    return this.http.get<InboundChannel[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/inbound/channels`, { headers: this.authorizationHeaders() });
  }
  createInboundChannel(clientBusinessId: string, request: InboundChannelRequest): Observable<InboundChannel> {
    return this.http.post<InboundChannel>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/inbound/channels`, request, { headers: this.authorizationHeaders() });
  }
  listInboundEnquiries(clientBusinessId: string, status?: string): Observable<InboundEnquiry[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<InboundEnquiry[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/inbound/enquiries`, { headers: this.authorizationHeaders(), params });
  }
  createInboundEnquiry(clientBusinessId: string, request: InboundEnquiryRequest): Observable<InboundEnquiry> {
    return this.http.post<InboundEnquiry>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/inbound/enquiries`, request, { headers: this.authorizationHeaders() });
  }
  convertInboundEnquiry(clientBusinessId: string, enquiryId: string): Observable<InboundEnquiry> {
    return this.http.post<InboundEnquiry>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/inbound/enquiries/${enquiryId}/convert`, {}, { headers: this.authorizationHeaders() });
  }
  respondInboundEnquiry(clientBusinessId: string, enquiryId: string, summary: string): Observable<InboundEnquiry> {
    return this.http.post<InboundEnquiry>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/inbound/enquiries/${enquiryId}/respond`, { summary }, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-12 communication ----------
  listChannelPreferences(clientBusinessId: string): Observable<ChannelPreference[]> {
    return this.http.get<ChannelPreference[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/communication/preferences`, { headers: this.authorizationHeaders() });
  }
  setChannelPreference(clientBusinessId: string, contactKey: string, channel: string, isOptedOut: boolean, source?: string): Observable<ChannelPreference> {
    return this.http.put<ChannelPreference>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/communication/preferences`, { contactKey, channel, isOptedOut, source }, { headers: this.authorizationHeaders() });
  }
  listSuppressions(clientBusinessId: string): Observable<SuppressionEntry[]> {
    return this.http.get<SuppressionEntry[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/communication/suppression`, { headers: this.authorizationHeaders() });
  }
  addSuppression(clientBusinessId: string, contactKey: string, reason: string, channel?: string): Observable<SuppressionEntry> {
    return this.http.post<SuppressionEntry>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/communication/suppression`, { contactKey, reason, channel }, { headers: this.authorizationHeaders() });
  }
  checkCommunicationEligibility(clientBusinessId: string, contactKey: string, channel: string): Observable<EligibilityResult> {
    return this.http.post<EligibilityResult>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/communication/eligibility`, { contactKey, channel }, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-13 campaigns ----------
  listCampaigns(clientBusinessId: string): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/campaigns`, { headers: this.authorizationHeaders() });
  }
  createCampaign(clientBusinessId: string, request: CampaignRequest): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/campaigns`, request, { headers: this.authorizationHeaders() });
  }
  startCampaign(clientBusinessId: string, campaignId: string): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/campaigns/${campaignId}/start`, {}, { headers: this.authorizationHeaders() });
  }
  pauseCampaign(clientBusinessId: string, campaignId: string): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/campaigns/${campaignId}/pause`, {}, { headers: this.authorizationHeaders() });
  }
  cancelCampaign(clientBusinessId: string, campaignId: string): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/campaigns/${campaignId}/cancel`, {}, { headers: this.authorizationHeaders() });
  }
  addCampaignAudience(clientBusinessId: string, campaignId: string, leadIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/campaigns/${campaignId}/audience`, { leadIds }, { headers: this.authorizationHeaders() });
  }
  addCampaignStep(clientBusinessId: string, campaignId: string, request: CampaignStepRequest): Observable<CampaignStep> {
    return this.http.post<CampaignStep>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/campaigns/${campaignId}/sequence`, request, { headers: this.authorizationHeaders() });
  }
  dispatchCampaign(clientBusinessId: string, campaignId: string): Observable<CampaignDispatch> {
    return this.http.post<CampaignDispatch>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/campaigns/${campaignId}/dispatch`, {}, { headers: this.authorizationHeaders() });
  }
  listCampaignMessages(clientBusinessId: string, campaignId: string): Observable<CampaignMessage[]> {
    return this.http.get<CampaignMessage[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/campaigns/${campaignId}/messages`, { headers: this.authorizationHeaders() });
  }
  campaignReport(clientBusinessId: string, campaignId: string): Observable<CampaignReport> {
    return this.http.get<CampaignReport>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/campaigns/${campaignId}/report`, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-14 agents ----------
  listAgents(clientBusinessId: string): Observable<AiAgent[]> {
    return this.http.get<AiAgent[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/agents`, { headers: this.authorizationHeaders() });
  }
  createAgent(clientBusinessId: string, request: AiAgentRequest): Observable<AiAgent> {
    return this.http.post<AiAgent>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/agents`, request, { headers: this.authorizationHeaders() });
  }
  addAgentVersion(clientBusinessId: string, agentId: string, behaviourJson: string, permissionsJson: string): Observable<AgentVersion> {
    return this.http.post<AgentVersion>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/agents/${agentId}/versions`, { behaviourJson, permissionsJson }, { headers: this.authorizationHeaders() });
  }
  activateAgent(clientBusinessId: string, agentId: string, versionId: string): Observable<AiAgent> {
    return this.http.post<AiAgent>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/agents/${agentId}/activate`, { versionId }, { headers: this.authorizationHeaders() });
  }
  runAgent(clientBusinessId: string, agentId: string, kind?: string, input?: string): Observable<AgentExecution> {
    return this.http.post<AgentExecution>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/agents/${agentId}/executions`, { kind, input }, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-15 voice ----------
  getVoiceProvider(clientBusinessId: string): Observable<VoiceProviderConfig> {
    return this.http.get<VoiceProviderConfig>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/voice/provider`, { headers: this.authorizationHeaders() });
  }
  setVoiceProvider(clientBusinessId: string, request: VoiceProviderRequest): Observable<VoiceProviderConfig> {
    return this.http.put<VoiceProviderConfig>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/voice/provider`, request, { headers: this.authorizationHeaders() });
  }
  listVoiceInteractions(clientBusinessId: string, status?: string): Observable<VoiceInteraction[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<VoiceInteraction[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/voice/interactions`, { headers: this.authorizationHeaders(), params });
  }
  createVoiceInteraction(clientBusinessId: string, request: VoiceInteractionRequest): Observable<VoiceInteraction> {
    return this.http.post<VoiceInteraction>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/voice/interactions`, request, { headers: this.authorizationHeaders() });
  }
  recordVoiceSummary(clientBusinessId: string, id: string, summary: string): Observable<VoiceInteraction> {
    return this.http.post<VoiceInteraction>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/voice/interactions/${id}/summary`, { summary }, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-16 appointments ----------
  listAppointmentTypes(clientBusinessId: string): Observable<AppointmentType[]> {
    return this.http.get<AppointmentType[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/appointments/types`, { headers: this.authorizationHeaders() });
  }
  createAppointmentType(clientBusinessId: string, request: AppointmentTypeRequest): Observable<AppointmentType> {
    return this.http.post<AppointmentType>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/appointments/types`, request, { headers: this.authorizationHeaders() });
  }
  listAppointments(clientBusinessId: string, from?: string, to?: string): Observable<Appointment[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<Appointment[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/appointments`, { headers: this.authorizationHeaders(), params });
  }
  createAppointment(clientBusinessId: string, request: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/appointments`, request, { headers: this.authorizationHeaders() });
  }
  rescheduleAppointment(clientBusinessId: string, id: string, startAt: string): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/appointments/${id}/reschedule`, { startAt }, { headers: this.authorizationHeaders() });
  }
  cancelAppointment(clientBusinessId: string, id: string): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/appointments/${id}/cancel`, {}, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-17 workflows ----------
  listWorkflows(clientBusinessId: string): Observable<WorkflowDefinition[]> {
    return this.http.get<WorkflowDefinition[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/workflows`, { headers: this.authorizationHeaders() });
  }
  createWorkflow(clientBusinessId: string, request: WorkflowRequest): Observable<WorkflowDefinition> {
    return this.http.post<WorkflowDefinition>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/workflows`, request, { headers: this.authorizationHeaders() });
  }
  triggerWorkflow(clientBusinessId: string, id: string, triggerKind?: string): Observable<WorkflowRun> {
    return this.http.post<WorkflowRun>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/workflows/${id}/runs`, { triggerKind }, { headers: this.authorizationHeaders() });
  }
  listWorkflowRuns(clientBusinessId: string, id: string): Observable<WorkflowRun[]> {
    return this.http.get<WorkflowRun[]>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/workflows/${id}/runs`, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-18 integrations ----------
  listIntegrationProviders(): Observable<IntegrationProvider[]> {
    return this.http.get<IntegrationProvider[]>(`${this.baseUrl}/api/v1/integrations/providers`, { headers: this.authorizationHeaders() });
  }
  listIntegrationConnections(clientBusinessId: string): Observable<IntegrationConnection[]> {
    return this.http.get<IntegrationConnection[]>(`${this.baseUrl}/api/v1/integrations/client-businesses/${clientBusinessId}/connections`, { headers: this.authorizationHeaders() });
  }
  createIntegrationConnection(clientBusinessId: string, request: IntegrationConnectionRequest): Observable<IntegrationConnection> {
    return this.http.post<IntegrationConnection>(`${this.baseUrl}/api/v1/integrations/client-businesses/${clientBusinessId}/connections`, request, { headers: this.authorizationHeaders() });
  }
  checkIntegrationConnection(clientBusinessId: string, id: string): Observable<IntegrationConnection> {
    return this.http.post<IntegrationConnection>(`${this.baseUrl}/api/v1/integrations/client-businesses/${clientBusinessId}/connections/${id}/check`, {}, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-19/30 reports ----------
  getSummaryReport(clientBusinessId?: string): Observable<SummaryReport> {
    let params = new HttpParams();
    if (clientBusinessId) params = params.set('clientBusinessId', clientBusinessId);
    return this.http.get<SummaryReport>(`${this.baseUrl}/api/v1/reports/summary`, { headers: this.authorizationHeaders(), params });
  }
  getFunnelReport(clientBusinessId: string): Observable<FunnelReport> {
    return this.http.get<FunnelReport>(`${this.baseUrl}/api/v1/reports/funnel`, { headers: this.authorizationHeaders(), params: new HttpParams().set('clientBusinessId', clientBusinessId) });
  }
  getAiUsageReport(clientBusinessId: string): Observable<AiUsageReport> {
    return this.http.get<AiUsageReport>(`${this.baseUrl}/api/v1/reports/usage-ai`, { headers: this.authorizationHeaders(), params: new HttpParams().set('clientBusinessId', clientBusinessId) });
  }
  getAiMonitoring(clientBusinessId: string, from: string, to: string): Observable<AiMonitoringReport> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<AiMonitoringReport>(`${this.baseUrl}/api/v1/client-businesses/${clientBusinessId}/ai-monitoring`, { headers: this.authorizationHeaders(), params });
  }
  getDomainReport(): Observable<DomainReport> {
    return this.http.get<DomainReport>(`${this.baseUrl}/api/v1/reports/domain`, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-20 billing ----------
  listSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.baseUrl}/api/v1/billing/plans`, { headers: this.authorizationHeaders() });
  }
  listSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.baseUrl}/api/v1/billing/subscriptions`, { headers: this.authorizationHeaders() });
  }
  createSubscription(planId: string, scope: string, clientBusinessId?: string): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.baseUrl}/api/v1/billing/subscriptions`, { planId, scope, clientBusinessId }, { headers: this.authorizationHeaders() });
  }
  getEntitlements(): Observable<Entitlements> {
    return this.http.get<Entitlements>(`${this.baseUrl}/api/v1/billing/entitlements`, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-21..27 candidate ----------
  getCandidateProfile(): Observable<CandidateProfile> {
    return this.http.get<CandidateProfile>(`${this.baseUrl}/api/v1/candidate/profile`, { headers: this.authorizationHeaders() });
  }
  upsertCandidateProfile(request: CandidateProfileRequest): Observable<CandidateProfile> {
    return this.http.put<CandidateProfile>(`${this.baseUrl}/api/v1/candidate/profile`, request, { headers: this.authorizationHeaders() });
  }
  deleteCandidateProfile(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/v1/candidate/profile`, { headers: this.authorizationHeaders() });
  }
  getCandidatePreferences(): Observable<CandidatePreferences> {
    return this.http.get<CandidatePreferences>(`${this.baseUrl}/api/v1/candidate/preferences`, { headers: this.authorizationHeaders() });
  }
  upsertCandidatePreferences(request: CandidatePreferencesRequest): Observable<CandidatePreferences> {
    return this.http.put<CandidatePreferences>(`${this.baseUrl}/api/v1/candidate/preferences`, request, { headers: this.authorizationHeaders() });
  }
  listResumes(): Observable<Resume[]> {
    return this.http.get<Resume[]>(`${this.baseUrl}/api/v1/candidate/resumes`, { headers: this.authorizationHeaders() });
  }
  createResume(request: ResumeRequest): Observable<Resume> {
    return this.http.post<Resume>(`${this.baseUrl}/api/v1/candidate/resumes`, request, { headers: this.authorizationHeaders() });
  }
  searchJobs(search?: string, savedOnly?: boolean): Observable<JobListing[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (savedOnly) params = params.set('savedOnly', true);
    return this.http.get<JobListing[]>(`${this.baseUrl}/api/v1/candidate/jobs`, { headers: this.authorizationHeaders(), params });
  }
  createJobListing(request: JobListingRequest): Observable<JobListing> {
    return this.http.post<JobListing>(`${this.baseUrl}/api/v1/candidate/jobs`, request, { headers: this.authorizationHeaders() });
  }
  saveJob(id: string): Observable<JobListing> {
    return this.http.post<JobListing>(`${this.baseUrl}/api/v1/candidate/jobs/${id}/save`, {}, { headers: this.authorizationHeaders() });
  }
  assessJobMatch(id: string): Observable<JobMatchAssessment> {
    return this.http.post<JobMatchAssessment>(`${this.baseUrl}/api/v1/candidate/jobs/${id}/match`, {}, { headers: this.authorizationHeaders() });
  }
  listJobAlerts(): Observable<JobAlert[]> {
    return this.http.get<JobAlert[]>(`${this.baseUrl}/api/v1/candidate/alerts`, { headers: this.authorizationHeaders() });
  }
  createJobAlert(request: JobAlertRequest): Observable<JobAlert> {
    return this.http.post<JobAlert>(`${this.baseUrl}/api/v1/candidate/alerts`, request, { headers: this.authorizationHeaders() });
  }
  listApplications(stage?: string): Observable<JobApplication[]> {
    let params = new HttpParams();
    if (stage) params = params.set('stage', stage);
    return this.http.get<JobApplication[]>(`${this.baseUrl}/api/v1/candidate/applications`, { headers: this.authorizationHeaders(), params });
  }
  createApplication(request: JobApplicationRequest): Observable<JobApplication> {
    return this.http.post<JobApplication>(`${this.baseUrl}/api/v1/candidate/applications`, request, { headers: this.authorizationHeaders() });
  }
  advanceApplication(id: string, stage: string, notes?: string): Observable<JobApplication> {
    return this.http.post<JobApplication>(`${this.baseUrl}/api/v1/candidate/applications/${id}/advance`, { stage, notes }, { headers: this.authorizationHeaders() });
  }
  recordApplicationOutcome(id: string, outcome: string, compensationOffered?: string): Observable<JobApplication> {
    return this.http.post<JobApplication>(`${this.baseUrl}/api/v1/candidate/applications/${id}/outcome`, { outcome, compensationOffered }, { headers: this.authorizationHeaders() });
  }

  listJobSources(): Observable<JobSource[]> {
    return this.http.get<JobSource[]>(`${this.baseUrl}/api/v1/candidate/job-sources`, { headers: this.authorizationHeaders() });
  }
  createJobSource(request: JobSourceRequest): Observable<JobSource> {
    return this.http.post<JobSource>(`${this.baseUrl}/api/v1/candidate/job-sources`, request, { headers: this.authorizationHeaders() });
  }
  listResumeVersions(resumeId: string): Observable<ResumeVersion[]> {
    return this.http.get<ResumeVersion[]>(`${this.baseUrl}/api/v1/candidate/resumes/${resumeId}/versions`, { headers: this.authorizationHeaders() });
  }
  confirmResumeVersion(resumeId: string, versionId: string, reviewedJson?: string): Observable<ResumeVersion> {
    return this.http.post<ResumeVersion>(`${this.baseUrl}/api/v1/candidate/resumes/${resumeId}/versions/${versionId}/confirm`, { reviewedJson }, { headers: this.authorizationHeaders() });
  }
  setJobAlertStatus(id: string, status: string): Observable<JobAlert> {
    return this.http.put<JobAlert>(`${this.baseUrl}/api/v1/candidate/alerts/${id}/status`, { status }, { headers: this.authorizationHeaders() });
  }

  // ---------- EP-28/29 notifications & audit ----------
  listNotifications(clientBusinessId?: string): Observable<AppNotification[]> {
    let params = new HttpParams();
    if (clientBusinessId) params = params.set('clientBusinessId', clientBusinessId);
    return this.http.get<AppNotification[]>(`${this.baseUrl}/api/v1/notifications`, { headers: this.authorizationHeaders(), params });
  }
  listAuditEvents(filters?: { entityType?: string; clientBusinessId?: string; take?: number }): Observable<AuditEntry[]> {
    let params = new HttpParams().set('take', filters?.take ?? 100);
    if (filters?.entityType) params = params.set('entityType', filters.entityType);
    if (filters?.clientBusinessId) params = params.set('clientBusinessId', filters.clientBusinessId);
    return this.http.get<AuditEntry[]>(`${this.baseUrl}/api/v1/audit-events`, { headers: this.authorizationHeaders(), params });
  }

  private authorizationHeaders(): HttpHeaders {
    const token = this.auth.accessToken;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}