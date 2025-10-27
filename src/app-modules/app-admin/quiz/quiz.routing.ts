import {RouterModule, Routes} from "@angular/router";
import {LayoutComponent} from "./layout/layout";
import {DashboardComponent} from "./views/dashboard/dashboard";
import {CreateComponent} from "./views/create/create";
import {ManageComponent} from "./views/manage/manage";
import {SearchComponent} from "./views/search/search";
import {QuizTestComponent} from "./views/quiz-test/quiz-test";

export const Quiz_Routes: Routes = [
  {
    path: '', component: LayoutComponent, data: { title: 'Quiz' },
    children:[
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
      { path: 'create', component: CreateComponent, data: { title: 'Create' } },
      { path: 'manage', component: ManageComponent, data: { title: 'Manage' } },
      { path: 'search', component: SearchComponent, data: { title: 'Search' } }
    ]
  },
  { path: 'test', component: QuizTestComponent, data: { title: 'Test' } }
];

export const QuizRoute = RouterModule.forChild(Quiz_Routes);

export const QUIZ_VIEWS = [LayoutComponent, DashboardComponent, ManageComponent, CreateComponent, SearchComponent, QuizTestComponent];
