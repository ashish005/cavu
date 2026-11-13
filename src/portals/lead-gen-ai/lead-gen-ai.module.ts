import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from '@app-global';
import { LeadGenAiDashboardComponent } from './features/dashboard/lead-gen-ai-dashboard.component';
import { LeadGenOpsComponent } from './features/operations/lead-gen-ops.component';
import { LeadGenCandidateComponent } from './features/clients/lead-gen-candidate.component';
import { LeadGenLeadsComponent } from './features/contacts/lead-gen-leads.component';
import { LeadGenPipelineComponent } from './features/pipeline/lead-gen-pipeline.component';
import { LeadGenLeadFormPopupComponent } from './features/shared/popups/lead-gen-lead-form-popup.component';
import { LeadGenEntityFormPopupComponent } from './features/shared/popups/lead-gen-entity-form-popup.component';
import { LeadGenSetupComponent } from './features/settings/lead-gen-setup.component';
import { LeadGenLeadDetailComponent } from './features/contacts/lead-gen-lead-detail.component';
import { LeadGenAnalyticsComponent } from './features/analytics/lead-gen-analytics.component';
import { LeadGenVoiceAiComponent } from './features/voice-ai/lead-gen-voice-ai.component';
import { LeadGenAppointmentsComponent } from './features/appointments/lead-gen-appointments.component';
import { LeadGenCampaignsComponent } from './features/campaigns/lead-gen-campaigns.component';
import { LeadGenWorkflowsComponent } from './features/workflows/lead-gen-workflows.component';
import { LeadGenAiAgentsComponent } from './features/ai-agents/lead-gen-ai-agents.component';
import { LeadGenConversationsComponent } from './features/conversations/lead-gen-conversations.component';
import { LeadGenIntegrationsComponent } from './features/integrations/lead-gen-integrations.component';
import { LeadGenProspectingComponent } from './features/prospecting/lead-gen-prospecting.component';
import { LeadGenBillingComponent } from './features/billing/lead-gen-billing.component';
import { LeadGenHelpComponent } from './features/help/lead-gen-help.component';
import { LeadGenTeamComponent } from './features/team/lead-gen-team.component';
import { LeadGenLeadEntityPopupComponent } from './features/shared/popups/entity/lead-form-popup.component';
import { LeadGenProspectFormPopupComponent } from './features/shared/popups/entity/prospect-form-popup.component';
import { LeadGenCampaignFormPopupComponent } from './features/shared/popups/entity/campaign-form-popup.component';
import { LeadGenAgentFormPopupComponent } from './features/shared/popups/entity/agent-form-popup.component';
import { LeadGenWorkflowFormPopupComponent } from './features/shared/popups/entity/workflow-form-popup.component';
import { LeadGenAppointmentTypePopupComponent } from './features/shared/popups/entity/appointment-type-popup.component';
import { LeadGenVoiceCallPopupComponent } from './features/shared/popups/entity/voice-call-popup.component';
import { LeadGenConnectPopupComponent } from './features/shared/popups/entity/integration-connect-popup.component';
import { LeadGenSubscriptionPopupComponent } from './features/shared/popups/entity/subscription-popup.component';
import { LeadGenInvitePopupComponent } from './features/shared/popups/entity/invite-popup.component';
import { LeadGenBookingPopupComponent } from './features/shared/popups/entity/booking-popup.component';
import { LeadGenReschedulePopupComponent } from './features/shared/popups/entity/reschedule-popup.component';
import { LeadGenAgentVersionPopupComponent } from './features/shared/popups/entity/agent-version-popup.component';
import { LeadGenAgentRunPopupComponent } from './features/shared/popups/entity/agent-run-popup.component';
import { LeadGenVoiceSummaryPopupComponent } from './features/shared/popups/entity/voice-summary-popup.component';
import { LeadGenDiscoveryJobPopupComponent } from './features/shared/popups/entity/discovery-job-popup.component';
import { LeadGenEnrichPopupComponent } from './features/shared/popups/entity/enrich-popup.component';
import { LeadGenSuppressionPopupComponent } from './features/shared/popups/entity/suppression-popup.component';
import { LeadGenRespondPopupComponent } from './features/shared/popups/entity/respond-popup.component';
import { LeadGenOutcomePopupComponent } from './features/shared/popups/entity/outcome-popup.component';
import { LeadGenCandidateJobPopupComponent } from './features/shared/popups/entity/candidate-job-popup.component';
import { LeadGenCandidateAlertPopupComponent } from './features/shared/popups/entity/candidate-alert-popup.component';
import { LeadGenCandidateResumePopupComponent } from './features/shared/popups/entity/candidate-resume-popup.component';
import { LeadGenRolePopupComponent } from './features/shared/popups/entity/role-popup.component';
import { LeadGenOrgPopupComponent } from './features/shared/popups/entity/org-popup.component';
import { LeadGenBusinessPopupComponent } from './features/shared/popups/entity/business-popup.component';
import { LeadGenWorkspacePopupComponent } from './features/shared/popups/entity/workspace-popup.component';
import { LeadGenProfilePopupComponent } from './features/shared/popups/entity/profile-popup.component';
import { LeadGenBusinessConfigPopupComponent } from './features/shared/popups/entity/business-config-popup.component';
import { LeadGenAgencyComponent} from './features/agency/lead-gen-agency.component';
import {MainLayout} from "./layouts/workspace-layout/layout";

@NgModule({
  declarations: [MainLayout, LeadGenAiDashboardComponent, LeadGenOpsComponent, LeadGenCandidateComponent, LeadGenLeadsComponent, LeadGenPipelineComponent, LeadGenLeadFormPopupComponent, LeadGenEntityFormPopupComponent, LeadGenSetupComponent, LeadGenLeadDetailComponent, LeadGenAnalyticsComponent, LeadGenVoiceAiComponent, LeadGenAppointmentsComponent, LeadGenCampaignsComponent, LeadGenWorkflowsComponent, LeadGenAiAgentsComponent, LeadGenConversationsComponent, LeadGenIntegrationsComponent, LeadGenProspectingComponent, LeadGenBillingComponent, LeadGenHelpComponent, LeadGenTeamComponent, LeadGenAgencyComponent, LeadGenLeadEntityPopupComponent, LeadGenProspectFormPopupComponent, LeadGenCampaignFormPopupComponent, LeadGenAgentFormPopupComponent, LeadGenWorkflowFormPopupComponent, LeadGenAppointmentTypePopupComponent, LeadGenVoiceCallPopupComponent, LeadGenConnectPopupComponent, LeadGenSubscriptionPopupComponent, LeadGenInvitePopupComponent, LeadGenBookingPopupComponent, LeadGenReschedulePopupComponent, LeadGenAgentVersionPopupComponent, LeadGenAgentRunPopupComponent, LeadGenVoiceSummaryPopupComponent, LeadGenDiscoveryJobPopupComponent, LeadGenEnrichPopupComponent, LeadGenSuppressionPopupComponent, LeadGenRespondPopupComponent, LeadGenOutcomePopupComponent, LeadGenCandidateJobPopupComponent, LeadGenCandidateAlertPopupComponent, LeadGenCandidateResumePopupComponent, LeadGenRolePopupComponent, LeadGenOrgPopupComponent, LeadGenBusinessPopupComponent, LeadGenWorkspacePopupComponent, LeadGenProfilePopupComponent, LeadGenBusinessConfigPopupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    GlobalModule,
    RouterModule.forChild([
      {
        path: '', data: { title: 'Home', header: 'Home' },
        component: MainLayout,
        children: [
          {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
          { path: 'dashboard', component: LeadGenAiDashboardComponent },
          { path: 'operations', component: LeadGenOpsComponent },
          { path: 'candidate', component: LeadGenCandidateComponent },
          { path: 'analytics', component: LeadGenAnalyticsComponent },
          { path: 'voice-ai', component: LeadGenVoiceAiComponent },
          { path: 'appointments', component: LeadGenAppointmentsComponent },
          { path: 'campaigns', component: LeadGenCampaignsComponent },
          { path: 'workflows', component: LeadGenWorkflowsComponent },
          { path: 'conversations', component: LeadGenConversationsComponent },
          { path: 'integrations', component: LeadGenIntegrationsComponent },
          { path: 'prospecting', component: LeadGenProspectingComponent },
          { path: 'billing', component: LeadGenBillingComponent },
          { path: 'help', component: LeadGenHelpComponent },
          { path: 'team', component: LeadGenTeamComponent },
          { path: 'agency', component: LeadGenAgencyComponent },
          { path: 'agents', component: LeadGenAiAgentsComponent },
          { path: 'leads/:id', component: LeadGenLeadDetailComponent },
          { path: 'leads', component: LeadGenLeadsComponent },
          { path: 'pipeline', component: LeadGenLeadsComponent, data: { view: 'board' } },
          { path: 'setup', component: LeadGenSetupComponent }
        ]
      }
    ])
  ]
})
export class LeadGenAiPortal {}