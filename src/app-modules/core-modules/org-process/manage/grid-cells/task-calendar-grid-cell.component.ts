import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DynamicComponent} from "@app-global";

@Component({
  standalone: false,
    template: `<div>
        <a class="text-primary text-xs _500" (click)="showDetails(context)"> {{ context.name }} </a>
        <div class="item-except text-xs h-1x">
         <span class="text-info mr-2">{{context.remark }}</span>
        </div>
    </div>`
})
export class CalendarNameActionCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
    showDetails(row: any){
        //this.router.navigate([row.accountId], {relativeTo: this.activatedRoute.parent.parent});
    }
}
@Component({
  standalone: false,
    template: `<div>
        <a class="text-primary text-xs _500">{{ context.startDate | dateFormat }}</a>
        <div class="item-except text-xs text-muted h-1x">{{context.startTime}} </div>
    </div>`
})
export class CalendarStartDateCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}

@Component({
  standalone: false,
    template: `<div>
        <a class="text-primary text-xs _500">{{context.endDate | dateFormat}}</a>
        <div class="item-except text-xs text-muted h-1x">{{context.endTime}} </div>
    </div>`
})
export class CalendarEndDateCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}
