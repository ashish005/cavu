import {Routes} from "@angular/router";
import {SyllabusInfoView} from "./views/syllabus-info.view";
import {TimeTableView} from "./views/time-table.view";
import {HomeWorkView} from "./views/home-work.view";

export const SyllabusRoutes: Routes = [
  {
    path: '',
    children:[
      { path: '', pathMatch: 'full', redirectTo:'info' },
      { path: 'info', component: SyllabusInfoView, data: {title: 'Info'} },
      { path: 'time-table', component: TimeTableView, data: {title: 'Time table'} },
      { path: 'home-work', component: HomeWorkView, data: {title: 'Home Work'} }
    ]
  }
];

export const SYLLABUS_VIEWS = [ SyllabusInfoView, TimeTableView, HomeWorkView ];
