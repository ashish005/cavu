import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

@Component({
    standalone: false,
    templateUrl: './layout.html',
    styles: [`::ng-deep ng-component{ display: contents;}`],
})
export class Layout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public viewNavigations: any = [
        //{ name: 'Workflow', sortOrder: 1, route: 'workflow'},
        { name: 'Process', sortOrder: 2, route: 'info'},
        { name: 'Tasks', sortOrder: 3, route: 'task'},
        { name: 'Scheduled Tasks', sortOrder: 4, route: 'scheduled'},
        { name: 'History', sortOrder: 5, route: 'history'}
    ];
    constructor(){}
    ngOnInit(){}
    onActivate(componentRef){ this.actionTemplate = componentRef.actionTemplate; }
}