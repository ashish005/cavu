import { NgModule } from '@angular/core';

import {APP_COMPONENT, routes} from './app.router';
import {CommonModule} from "@angular/common"
import {COMPANY_SERVICES} from "./services";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    APP_COMPONENT,
    RouterModule.forChild(routes)
  ],
  providers: [ COMPANY_SERVICES ]
})
export class SetupModule { }
