import {Routes} from '@angular/router';
import {TeamLayoutComponent} from "./layout/layout";
import {GroupCategoryView} from "./views/group-category.view";
import {TeamSetupAPIResolver} from "./services";
import {UserGroupView} from "./views/user-group.view";
import {TeamView} from "./views/team.view";

export const TeamRoutes: Routes = [
  {
    path: '', resolve: { items: TeamSetupAPIResolver },
    component: TeamLayoutComponent,
    children: [
      { path: '', component: TeamView },
      { path: 'category', component: GroupCategoryView },
      { path: 'setup-rules', component: UserGroupView, data: {title: 'master_type.modules.document.category.title'} }
    ]
  }
];

export const TEAM_VIEW = [ TeamLayoutComponent, TeamView, GroupCategoryView, UserGroupView ];