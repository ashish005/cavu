import {Routes} from "@angular/router";
import {ProfileInfoView} from "./views/info.view";
import {ProfileLayout} from "./layout/layout";
import {ProfileActivityView} from "./views/activity.view";
import {ProfileFriendsView} from "./views/friends.view";
import {ProfileCredentialView} from "./views/credential.view";

export const ProfileRoutes: Routes = [
  {
    path: '', component: ProfileLayout,
    children:[
      { path: '', pathMatch: 'full', redirectTo:'info' },
      { path: 'info', component: ProfileInfoView, data: {title: 'Info'} },
      { path: 'activity', component: ProfileActivityView, data: {title: 'Activity'} },
      { path: 'friends', component: ProfileFriendsView, data: {title: 'Friends'} },
      { path: 'credential', component: ProfileCredentialView, data: {title: 'Credential'} },

    ]
  }
];

export const PROFILE_VIEWS = [ ProfileLayout, ProfileInfoView, ProfileActivityView, ProfileFriendsView, ProfileCredentialView ];
