import {Component, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";

@Component({
  standalone: false,
  template: '<div> scheduler-calender </div>'
  //template: '<scheduler-calender></scheduler-calender>'
})
export class SchedulerLayout {}

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: SchedulerLayout}
        ]),
      GlobalModule
    ],
    providers: [],
    declarations: [SchedulerLayout]
})

export class SchedulerModule{}
