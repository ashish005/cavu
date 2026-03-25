import { NgModule } from '@angular/core';

import {APP_COMPONENT, routes} from './app.router';
import {CommonModule} from "@angular/common"
import {COMPANY_SERVICES} from "./services";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {GlobalModule, TypingComponent} from "@app-global";
import {CoreLayout} from "./layouts/core.layout";

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule, // Add CommonModule to imports
    FormsModule, RouterModule, TypingComponent,
    RouterModule.forChild(routes), GlobalModule
  ],
  declarations: [ CoreLayout, APP_COMPONENT ],
  providers: [ COMPANY_SERVICES ]
})
export class SetupModule { }
