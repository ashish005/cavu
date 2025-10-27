import {Component, Directive, Input, OnDestroy, OnInit} from "@angular/core";
import {MyTaskQueryOptions} from "../domains/my-task.serializer";
import {MyTaskService} from "../services/my-task.service";
import {CoreLoaderComponent} from "../domains/loader.component";

@Component({
  standalone: false,
    selector: 'board-priority-task',
    templateUrl: './templates/board-priority-task-row.html'
})
export class BoardPriorityTaskRowComponent extends CoreLoaderComponent implements OnInit, OnDestroy {
    gridOptions: any = {};
    @Input() taskPriorityId: any;
    queryOption: any = new MyTaskQueryOptions();

    constructor(public service: MyTaskService) {
        super();
        this.gridOptions.columnDefs = [
            {headerName: 'grid.header.dashboard.pay_mode', field: 'paymentMode'},
            {headerName: 'grid.header.dashboard.total_paid', field: 'totalPaid'}
        ];
        /*this.apiResolver.$synchFilterViews.subscribe((r)=> {
          this.callService(r);
        });*/
    }

    ngOnInit() { this.callService(); }

    callService() {
        this.queryOption.taskPriorityId = this.taskPriorityId;
        //this.queryOption.orgUserId = this.service.orgLoggedInUserId;

        this.isLoading = true;
        this.count = 0;
        /*const update = () => {
          if (!this.isLoading) {
            clearInterval(intervalCounterId);
            this.count = 0;
          } else {
            var remaining = 100 - this.count;
            this.count += 10;
          }
        };
        const intervalCounterId = setInterval(update, 200);*/
        this.subscriber = this.service.list(this.queryOption).subscribe(this.success, this.failure);
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }
}
