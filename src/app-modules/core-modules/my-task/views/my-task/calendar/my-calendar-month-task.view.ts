import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender} from "@app-global";
import {MyTaskService} from "../../../services/my-task.service";
import {MyTask, MyTaskQueryOptions} from "../../../domains/my-task.serializer";

@Component({
  standalone: false,
  template: '<calendar-month></calendar-month>'
})
export class MyCalendarMonthTaskView extends ViewExtender<MyTask> implements OnInit {
  override coreState: MyTaskQueryOptions = new MyTaskQueryOptions();
  constructor(public override service: MyTaskService, public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
  }
  ngOnInit(){}
}
