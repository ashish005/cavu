import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from '@app-global';
import { LeadGenAiDashboardComponent } from './views/lead-gen-ai-dashboard.component';
import {MainLayout} from "./layout/layout";

@NgModule({
  declarations: [MainLayout, LeadGenAiDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GlobalModule,
    RouterModule.forChild([
      {
        path: '', data: {title: 'Home', header: 'Home'},
        component: MainLayout,
        children: [
          { path: '', component: LeadGenAiDashboardComponent }
        ]
      }
    ])
  ]
})
export class LeadGenAiPortal {}