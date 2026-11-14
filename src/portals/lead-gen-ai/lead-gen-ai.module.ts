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
import { OpsComponent } from "./features/ai-studio/ops/ops.component";

const studioRoutes = [
  { path: 'command-center', component: CommandCenterComponent },
  { path: 'discovery', component: DiscoveryStudioComponent },
  { path: 'entities', component: EntitiesComponent },
  { path: 'candidates', component: EntitiesComponent },
  { path: 'pipeline', component: EntitiesComponent },
  { path: 'conversations', component: ConversationsComponent },
  { path: 'campaigns', component: GrowthComponent },
  { path: 'appointments', component: GrowthComponent },
  { path: 'agents', component: AutomationComponent },
  { path: 'workflows', component: AutomationComponent },
  { path: 'operations', component: OpsComponent },
  { path: 'analytics', component: CommandCenterComponent },
  { path: 'clients', component: CommandCenterComponent },
  { path: 'workspaces', component: CommandCenterComponent },
  { path: 'billing', component: CommandCenterComponent },
  { path: 'team', component: CommandCenterComponent },
  { path: 'jobs', component: EntitiesComponent },
  
  { path: 'settings', component: OpsComponent },
  { path: 'tenants', component: CommandCenterComponent },
  { path: 'audit', component: OpsComponent },
  { path: 'integrations', component: OpsComponent },
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
