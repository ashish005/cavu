import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GlobalModule } from '@app-global';
import { MainLayout } from "./layouts/workspace-layout/layout";
import { CommandCenterComponent } from "./features/ai-studio/command-center/command-center.component";
import { DiscoveryStudioComponent } from "./features/ai-studio/discovery/discovery.component";
import { EntitiesComponent } from "./features/ai-studio/entities/entities.component";
import { ConversationsComponent } from "./features/ai-studio/conversations/conversations.component";
import { AutomationComponent } from "./features/ai-studio/automation/automation.component";
import { GrowthComponent } from "./features/ai-studio/growth/growth.component";
import { PipelinesComponent } from './features/ai-studio/pipelines/pipelines.component';
import { InboxComponent } from './features/ai-studio/inbox/inbox.component';
import { SettingsComponent } from './features/ai-studio/settings/settings.component';
import { AnalyticsComponent } from './features/ai-studio/analytics/analytics.component';
import { OpsComponent } from "./features/ai-studio/ops/ops.component";

const studioRoutes = [
  { path: 'command-center', data: { title: 'Command Center' }, component: CommandCenterComponent },
  { path: 'discovery', data: { title: 'Discovery Studio' }, component: DiscoveryStudioComponent },
  { path: 'entities', data: { title: 'Entities & Intelligence' }, component: EntitiesComponent },
  { path: 'candidates', data: { title: 'Candidates' }, component: EntitiesComponent },
  { path: 'pipeline', data: { title: 'Pipelines' }, component: PipelinesComponent },
  { path: 'pipelines', data: { title: 'Pipelines & Schedule' }, component: PipelinesComponent },
  { path: 'conversations', data: { title: 'Inbox' }, component: ConversationsComponent },
  { path: 'inbox', data: { title: 'Inbox & Voice' }, component: InboxComponent },
  { path: 'campaigns', data: { title: 'Campaigns' }, component: GrowthComponent },
  { path: 'appointments', data: { title: 'Appointments' }, component: GrowthComponent },
  { path: 'agents', data: { title: 'AI Agents' }, component: AutomationComponent },
  { path: 'workflows', data: { title: 'Workflows' }, component: AutomationComponent },
  { path: 'automation', data: { title: 'AI Workforce & Flows' }, component: AutomationComponent },
  { path: 'operations', data: { title: 'Operations' }, component: OpsComponent },
  { path: 'analytics', data: { title: 'Analytics' }, component: AnalyticsComponent },
  { path: 'settings', data: { title: 'Settings' }, component: SettingsComponent },
  { path: 'clients', data: { title: 'Agency Clients' }, component: CommandCenterComponent },
  { path: 'workspaces', data: { title: 'Workspaces' }, component: CommandCenterComponent },
  { path: 'billing', data: { title: 'Billing' }, component: CommandCenterComponent },
  { path: 'team', data: { title: 'Team' }, component: CommandCenterComponent },
  { path: 'jobs', data: { title: 'Jobs' }, component: EntitiesComponent },
  
  { path: 'settings', data: { title: 'Settings' }, component: OpsComponent },
  { path: 'tenants', data: { title: 'Tenants' }, component: CommandCenterComponent },
  { path: 'audit', data: { title: 'Audit' }, component: OpsComponent },
  { path: 'integrations', data: { title: 'Integrations' }, component: OpsComponent },
];

@NgModule({
  declarations: [MainLayout],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    GlobalModule,
    RouterModule.forChild([
      {
        path: '', data: { title: 'AI Studio', header: 'AI Studio' },
        component: MainLayout,
        children: [
          //{ path: '', pathMatch: 'full', redirectTo: 'business-growth/command-center' },
          { path: ':workspace', children: studioRoutes },
          { path: '**', redirectTo: 'business-growth/command-center' }
        ]
      }
    ])
  ]
})
export class LeadGenAiPortal {}
