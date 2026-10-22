import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AsidePanelComponent, GlobalModule} from "@app-global";
import {TeamsView} from "./teams.view";
import {TeamApiService} from "./team-api.service";
import {PeopleLayoutComponent} from "./people-layout.component";

/** Teams (`/app/admin/org-team`) on api/v1/teams: organisation-wide, used by processes, tasks and notifications. */
@NgModule({
    imports: [
        CommonModule, FormsModule, GlobalModule, AsidePanelComponent, PeopleLayoutComponent,
        RouterModule.forChild([{
            path: '', component: PeopleLayoutComponent,
            children: [{path: '', component: TeamsView, data: {title: 'Teams', header: 'Teams'}}, {path: '**', redirectTo: ''}]
        }])
    ],
    providers: [TeamApiService],
    declarations: [TeamsView]
})
export class TeamSetupModule {}
