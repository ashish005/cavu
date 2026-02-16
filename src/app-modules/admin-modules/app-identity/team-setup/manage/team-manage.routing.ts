import {ActivatedRoute, Router, Routes} from '@angular/router';
import {Layout, TeamLayout, TeamSubLayout} from "./layout/layout";
import {RulesSetupComponent} from "./views/rules-setup.component";
import {TeamRecordsComponent} from "./views/team-records.component";
import {TeamSetupAPIResolver} from "./services";
import {TeamView} from "./views/team.view";
export const TeamRoutes: Routes = [
  {
      path: '', component: Layout, resolve: { items: TeamSetupAPIResolver },
      children: [
          {path: '', redirectTo: 'manage', pathMatch: 'full'},
          { path: 'manage', component: TeamView },
          {
              path: 'list-view', component: TeamLayout,
              children: [
                  {
                      path: ':teamId', component: TeamSubLayout,
                      children: [
                          { path: '', pathMatch: 'full', redirectTo:'rules' },
                          { path: 'rules', component: RulesSetupComponent },
                          { path: 'records', component: TeamRecordsComponent }
                      ]
                  }
              ]
          }
      ]
  }
];

export const TEAM_VIEW = [
    Layout, TeamLayout, TeamSubLayout,
    TeamView, RulesSetupComponent, TeamRecordsComponent
];
