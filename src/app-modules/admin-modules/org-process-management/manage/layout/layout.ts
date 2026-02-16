import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
    templateUrl: './layout.html',
    styles: [`::ng-deep ng-component{ display: contents;}`],
})
export class Layout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    public viewNavigations: any = [
        //{ name: 'Workflow', sortOrder: 1, route: 'workflow'},
        { name: 'Process', sortOrder: 2, route: 'info'},
        { name: 'Tasks', sortOrder: 3, route: 'task'},
        { name: 'Scheduled Tasks', sortOrder: 4, route: 'scheduled'},
        { name: 'History', sortOrder: 5, route: 'history'}
    ];
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

    constructor(public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef){}

    ngAfterContentChecked(){ this.cdref.detectChanges(); }
    onActivate(componentRef) {
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}