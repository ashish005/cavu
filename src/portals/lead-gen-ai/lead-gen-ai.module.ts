import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from '@app-global';
import { LeadGenAiDashboardComponent } from './views/lead-gen-ai-dashboard.component';
import { LeadGenOpsComponent } from './views/lead-gen-ops.component';
import { LeadGenCandidateComponent } from './views/lead-gen-candidate.component';
import { LeadGenLeadsComponent } from './views/lead-gen-leads.component';
import {MainLayout} from "./layout/layout";

@NgModule({
  declarations: [MainLayout, LeadGenAiDashboardComponent, LeadGenOpsComponent, LeadGenCandidateComponent, LeadGenLeadsComponent],
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
          { path: 'leads', component: LeadGenLeadsComponent }
        ]
      }
    ])
  ]
})
export class LeadGenAiPortal {}