import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DynamicComponent} from "@app-global";
import {MyTaskSchedule} from "../domains/my-task/my-task-schedule.serializer";

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500" (click)="showDetails(context)"> {{ context.name }} </a>
        <div class="item-except text-xs h-1x">
         <span class="text-info mr-2">{{context.description }}</span>
        </div>
    </div>`
})
export class ScheduledTaskNameActionCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
    showDetails(row: MyTaskSchedule){
        //this.router.navigate([row.accountId], {relativeTo: this.activatedRoute.parent.parent});
    }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500">{{ context.startDate | dateFormat }}</a>
        <div class="item-except text-xs text-muted h-1x">{{context.startTime}} </div>
    </div>`
})
export class ScheduledStartDateCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-xs _500">{{context.endDate | dateFormat}}</a>
        <div class="item-except text-xs text-muted h-1x">{{context.endTime}} </div>
    </div>`
})
export class ScheduledEndDateCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}

@Component({
  standalone: false,
    template: `<div>
        <span class="badge blue-grey">{{ context.lastRunResult }}</span>
        <!--{{ context.lastRunRemark }}
        {{ context.lastRunVerificationRemark }}-->
        <div class="item-except text-xs text-muted h-1x">{{ context.lastRunVerifiedByEmployee }}</div>
    </div>`
})
export class ScheduledTaskLastRunCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}
