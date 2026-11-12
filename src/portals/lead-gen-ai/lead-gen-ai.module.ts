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
import { LeadGenAgencyComponent } from './features/agency/lead-gen-agency.component';
import {MainLayout} from "./layouts/workspace-layout/layout";

@NgModule({
  declarations: [MainLayout, LeadGenAiDashboardComponent, LeadGenOpsComponent, LeadGenCandidateComponent, LeadGenLeadsComponent, LeadGenPipelineComponent, LeadGenLeadFormPopupComponent, LeadGenEntityFormPopupComponent, LeadGenSetupComponent, LeadGenLeadDetailComponent, LeadGenAnalyticsComponent, LeadGenVoiceAiComponent, LeadGenAppointmentsComponent, LeadGenCampaignsComponent, LeadGenWorkflowsComponent, LeadGenAiAgentsComponent, LeadGenConversationsComponent, LeadGenIntegrationsComponent, LeadGenProspectingComponent, LeadGenBillingComponent, LeadGenHelpComponent, LeadGenTeamComponent, LeadGenAgencyComponent],
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