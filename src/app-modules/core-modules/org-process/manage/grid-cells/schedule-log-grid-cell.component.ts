import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ACTION_ENUM, DynamicComponent} from "@app-global";

@Component({
    standalone: false,
    template: `<div>
        <a class="text-xs _500">{{ context.taskName }} </a>
        <div class="item-except text-xs h-1x">
            <span class="badge green mx-1">{{context.frequencyTypeName}}</span>
            <span class="badge green mx-1">{{context.taskPriorityName}}</span>
            <span class="badge lime">{{ context.processName }}</span>
        </div>
    </div>`
})
export class ScheduleLogNameActionCell extends DynamicComponent {
    constructor(private router: Router) {
        super();
    }
}
