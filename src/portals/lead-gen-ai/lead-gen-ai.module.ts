import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from '@app-global';
import {MainLayout} from "./layouts/workspace-layout/layout";

@NgModule({
  declarations: [MainLayout],
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
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
        ]
      }
    ])
  ]
})
export class LeadGenAiPortal {}