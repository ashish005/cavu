import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {GlobalModule} from "@app-global";
import {TEAM_VIEW, TeamRoutes} from "./team.routing";
import {TEAM_SERVICES} from "./services";
import {TEAM_COMPONENT} from "./components";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild(TeamRoutes),
    GlobalModule
  ],
  declarations: [ TEAM_VIEW, TEAM_COMPONENT ],
  providers: [ TEAM_SERVICES ]
})
export class TeamManageModule{}
