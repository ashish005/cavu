import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {AsidePanelComponent, GlobalModule} from "@app-global";
import {NOTIFICATION_SERVICES} from "./notification-api.service";
import {NotifyOverviewView} from "./views/overview.view";
import {NotifyKindsView} from "./views/kinds.view";
import {NotifyLogView} from "./views/log.view";
import {NotifyMyPreferencesView} from "./views/my-preferences.view";
import {PeopleLayoutComponent} from "../org-team-management/people-layout.component";

// Settings › Notifications (`/app/admin/notification`) on api/v1/notification-settings: overview, what is sent and how,
// the delivery log and each person's own choices; shares its side menu with Teams.

const routes: Routes = [{
    path: '', component: PeopleLayoutComponent,
    children: [
        {path: '', pathMatch: 'full', redirectTo: 'overview'},
        {path: 'overview', component: NotifyOverviewView, data: {title: 'Notifications · overview'}},
        {path: 'list', component: NotifyKindsView, data: {title: 'What is sent'}},
        {path: 'log', component: NotifyLogView, data: {title: 'Delivery log'}},
        {path: 'me', component: NotifyMyPreferencesView, data: {title: 'My notifications'}},
        // Links to the screens this replaced.
        {path: '**', redirectTo: 'overview'}
    ]
}];

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule.forChild(routes), GlobalModule, AsidePanelComponent, PeopleLayoutComponent],
    providers: [NOTIFICATION_SERVICES],
    declarations: [NotifyOverviewView, NotifyKindsView, NotifyLogView, NotifyMyPreferencesView]
})
export class NotificationModule {}
