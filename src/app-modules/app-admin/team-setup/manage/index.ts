import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {GlobalModule} from "@app-global";
import {TEAM_VIEW, TeamRoutes} from "./team-manage.routing";
import {TEAM_SERVICES} from "./services";
import {TEAM_COMPONENT} from "./components";
import {TEAM_CELL_COMPONENT} from "./grid-cells";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(TeamRoutes),
    GlobalModule
  ],
  declarations: [ TEAM_VIEW, TEAM_COMPONENT, TEAM_CELL_COMPONENT ],
  providers: [ TEAM_SERVICES ]
})
export class TeamSetupModule{}
