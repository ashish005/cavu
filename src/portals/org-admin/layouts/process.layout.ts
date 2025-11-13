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
                { routeTo: ['workflow'], icon:"fa fa-dashboard", key: 'Workflow' },
                { routeTo: ['all'], icon:"fa fa-envelope", key: 'Processes' },
            ]
        },
        {
            isFLatChildren: true, key: 'Task',
            children:[
                { routeTo: ['task'], icon:"fa fa-envelope", key: 'Tasks' },
                { routeTo: ['task-info'], icon:"fa fa-envelope", key: 'Task Runner' },
            ]
        },
        {
            isFLatChildren: true, key: 'Schedule',
            children:[
                { routeTo: ['scheduled'], icon:"fa fa-bell", key: 'Task Schedule' },
                { routeTo: ['task-reminder'], icon:"fa fa-bell", key: 'reminder' },
                { routeTo: ['task-calendar'], icon:"fa fa-bell", key: 'calendar' },
            ]
        },
        {
            isFLatChildren: true, key: 'Other',
            children:[
                { routeTo: ['history'], icon:"fa fa-bell", key: 'History' },
                { routeTo: ['setup'], icon:"fa fa-bell", key: 'Setup' }
            ]
        }
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public cdref: ChangeDetectorRef){}
    ngAfterContentChecked() { this.cdref.detectChanges(); }
    onActivate(componentRef) {}
}
