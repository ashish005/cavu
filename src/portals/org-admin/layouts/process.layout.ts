import {ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  templateUrl: './templates/process.html',
  styles: [`::ng-deep ng-component{ display: contents;}`],
  standalone: false
})
export class ProcessLayout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children:[
                { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'dashboard' },
                { routeTo: ['master/tree'], icon:"fa fa-envelope", key: 'Org Workflow' },
                { routeTo: ['setup'], icon:"fa fa-bell", key: 'Setup' }
            ]
        },
        {
            isFLatChildren: true, key: 'Process Instance',
            children:[
                { routeTo: ['instance/info'], icon:"fa fa-envelope", key: 'Process' },
                { routeTo: ['instance/task-runner'], icon:"fa fa-envelope", key: 'Task Runner' },
            ]
        },
        {
            isFLatChildren: true, key: 'Schedule',
            children:[
                { routeTo: ['instance/scheduled'], icon:"fa fa-bell", key: 'Task Schedule' },
                { routeTo: ['instance/task-reminder'], icon:"fa fa-bell", key: 'reminder' },
                //{ routeTo: ['task-calendar'], icon:"fa fa-bell", key: 'calendar' },
            ]
        },
        {
            isFLatChildren: true, key: 'Other',
            children:[
                { routeTo: ['instance/history'], icon:"fa fa-bell", key: 'History' },

            ]
        }
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public cdref: ChangeDetectorRef){}
    ngAfterContentChecked() { this.cdref.detectChanges(); }
    onActivate(componentRef) {}
}
