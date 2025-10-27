import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender} from "@app-global";
import {MyTaskAPIResolver} from "../services/api.resolver";
import {MyTaskService} from "../services/my-task.service";
import { TaskLastRunLogCell, TaskNameActionCell, TaskScheduleInfoCell, TaskNextScheduleRunCell } from "../grid-cells/my-task-grid-cell.component";
import {MyTask, MyTaskQueryOptions} from "../domains/my-task.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/my-task.html'
})
export class ManageMyTaskView extends ViewExtender<MyTask> implements OnInit, OnDestroy {
  menuItems: Array<any> = [
    { name: 'List', sortOrder: 2, route: 'list', icon: 'fa-list'},
    { name: 'Board', sortOrder: 3, route: 'board', icon: 'fa-table'},
    { name: 'Calendar', sortOrder: 4, route: 'calendar', icon: 'fa-calendar'},
  ];
  viewNavigations = {
        'task': [
            /*{ name: 'Assigned To Me', sortOrder: 1, route: 'assigned'},
            { name: 'Reported To Me', sortOrder: 2, route: 'reported'},
            { name: 'Verified By Me', sortOrder: 3, route: 'verified'},*/
            { name: 'My Tasks', sortOrder: 4, route: '../list'},
            //{ name: 'Scheduled Tasks', sortOrder: 5, route: 'scheduled'},
            { name: 'Task Logs', sortOrder: 5, route: '../../task-log'},
            /*{ name: 'Calendar', sortOrder: 7, route: 'calendar'},
            { name: 'Reminder', sortOrder: 6, route: 'reminder'}*/
        ]
    };
  override coreState: MyTaskQueryOptions = new MyTaskQueryOptions();
  constructor(public router: Router,
              public override service: MyTaskService,
              public override activatedRoute: ActivatedRoute,
              public apiResolver: MyTaskAPIResolver) {
      super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'name', cellTemplate: TaskNameActionCell},
          {headerName: 'Schedules', field: 'modifiedDate', cellTemplate: TaskScheduleInfoCell},
          {headerName: 'Last Run - Due/ Start - End', field: 'lastRunLog.startDate', cellTemplate: TaskLastRunLogCell},
          {headerName: 'Next Run', field: 'lastRun', cellTemplate: TaskNextScheduleRunCell}
      ];
  }

  //onActivate(componentRef){ super.actionTemplate = componentRef.actionTemplate; }

  override ngOnDestroy(){ super.ngOnDestroy(); }

  ngOnInit(){
    //this.orgTaskId = this.activatedRoute.snapshot.params.taskId;
    // (<MyTaskQueryOptions>this.coreState).orgUserId = this.coreService.currentUser.id;
    super.populateGrid();
    //this.subjectSubscription = this.apiResolver.refreshTask$.subscribe(r => { if(r){super.populateGrid();} });
  }

    actionCb(task: MyTask){
        const { id } = task;
        const inputData: any = {
            id: id,
            orgTaskId: id
        };
        this.apiResolver.showEventTaskPopup(inputData, { text: `${task.name}`, desc: `Task Manage` });
    }

  showOrgTaskPopup(inputData: any, header, type){
        // const popup = { header: header, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        // const success = (resp: any) => {
        //     this.populateGrid();
        //     this.sharedService.destroy();
        // };
        //
        // const error = (resp: any) => {
        //     this.sharedService.destroy();
        // };
        //
        // let modal$ = this.sharedService.showCustomPopup(OrgTaskCeComponent, popup, inputData);
        // modal$.then(success, error);
    }
  //
  // addTaskScheduler(task) {
  //     const { id, isManual, isFeeTask, isPeriodType, name } = task;
  //     const popupHeaderOption = { text: `${name}`, desc: `Schedule a tasks - ${ACTION_ENUM.UPDATE} Scheduler` };
  //     const inputData: any = {
  //         id: null, //Schedular ID
  //         taskId: id,//Org Task Id
  //         isManual: isManual,
  //         isFeeTask: isFeeTask,
  //         isPeriodType: isPeriodType
  //     };
  //     this.apiResolver.showSchedulerPopup(inputData, popupHeaderOption);
  // }
  //
  //   createReminder(task: OrgMyTask){
  //       const { id,orgReminders } = task;
  //
  //       const popupHeaderOption = { text: `Reminder for ${task.name}`, desc: `Reminder will be send to user prior to scheduled time` };
  //       const inputData: any = {
  //           notificationId: null,
  //           taskId: id,
  //           list: orgReminders,
  //           activeView: 'reminder'
  //       };
  //       this.apiResolver.showNotificationReminder(inputData, popupHeaderOption);
  //   }
  //
  //   eventTaskCalendar(task: OrgMyTask){
  //       const { id } = task;
  //       const inputData: any = {
  //           id: id,
  //           orgTaskId: id
  //       };
  //     this.apiResolver.showEventTaskPopup(inputData, { text: `Reminder for ${task.name}`, desc: `Reminder will be send to user prior to scheduled time` });
  //   }
  //
  //   checkActivity(task: OrgMyTask)
  //   {
  //       const { id } = task;
  //
  //       const popupHeaderOption = { text: `Activity for ${task.name}`, desc: `Activity` };
  //       const inputData: any = {
  //           orgTaskId: id
  //       };
  //       this.apiResolver.showEventTaskActivityPopup(inputData, popupHeaderOption);
  //   }
}
