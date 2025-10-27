import {ActivatedRoute, Router, Routes} from '@angular/router';
import {TeamLayout} from "./layout/layout";
import {RulesSetupComponent} from "./views/rules-setup.component";
import {TeamRecordsComponent} from "./views/team-records.component";
import {TeamSetupAPIResolver} from "./services";
import {Component, OnInit, TemplateRef} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {TeamFilterTypeOptionsComponent} from "./components/team-filter-type-options.component";
import {TeamSetupService} from "./services/team.service";
import {TeamUserGroup} from "./domains/user-group.serializer";
import {TeamView} from "./views/team.view";

@Component({templateUrl: './layout/sub-layout.html'})
export class TeamSubLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    isLoading: boolean = false;
    public viewNavigations: any = [
        { name: 'Setup Rules', sortOrder: 2, route: 'rules'},
        { name: 'Apply Rule', sortOrder: 4, route: 'records'}
    ];
    team: TeamUserGroup;
    constructor(public router: Router, public activatedRoute: ActivatedRoute,
                private sharedService: SharedService, public service: TeamSetupService){
    }
    onActivate(componentRef){ this.actionTemplate = componentRef.actionTemplate; }

    ngOnInit(){
        this.activatedRoute.params.subscribe((parms: { teamId: string }) =>
        {
            this.populateTeam(parms.teamId);
        });
    }

    populateTeam(teamId){
        this.isLoading = true;
        const success=(resp)=> {
            this.team = resp.data;
            this.service.teamChangeEvent.next(resp.data);
            this.isLoading = false;
        };
        const error=()=> {
            this.isLoading = false;
        };
        this.service.read(teamId).toPromise().then(success, error);
    }

    showUserFilters() {
        const popupOptions = { header: {text: `User Filter Type`, desc: ''}, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_25 };
        const onSuccess = (resp)=> {this.sharedService.destroy();};
        const failure = (resp)=> {this.sharedService.destroy();};
        this.sharedService.showCustomPopup(TeamFilterTypeOptionsComponent, popupOptions, {}).then(onSuccess, failure);
    }
}
export const TeamRoutes: Routes = [
  {
      path: '', resolve: { items: TeamSetupAPIResolver },
      children: [
          { path: 'manage', component: TeamView },
          {
              path: 'config', component: TeamLayout,
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

export const TEAM_VIEW = [ TeamLayout, TeamView, TeamSubLayout, RulesSetupComponent, TeamRecordsComponent ];
