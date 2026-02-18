import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
    templateUrl: './layout.html'
})
export class ConfigLayout implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;

    public pageTitleLayoutTemplate: TemplateRef<any>;
    public actionLayoutTemplate: TemplateRef<any>;


    pageTitle: string;
    constructor(public activatedRoute: ActivatedRoute, private router: Router){
        const { title } = this.activatedRoute.snapshot.data;
        this.pageTitle = title;
    }

    public items: Array<any> = [
        {
            id:1, icon:"fa fa-dashboard", isHeading: true, name: "Main", sortOrder: 1,
            children: [
                { id:3, icon:"fa fa-dashboard", route: 'phase', name: "Process Phase Status", sortOrder: 1 }
            ]
        },
        {
            id:2, icon:"fa fa-dashboard", isHeading: true, name: "Task", sortOrder: 2,
            children: [
                { id:2, icon:"fa fa-dashboard", route: 'frequency', name: "Frequency", sortOrder: 1 },
                { id:4, icon:"fa fa-dashboard", route: 'task-priority', name: "Task Priority", sortOrder: 1 },
                { id:5, icon:"fa fa-dashboard", route: 'task-status', name: "Task Status", sortOrder: 1 }
            ]
        }
    ];

    ngOnInit(){}

    onActivate(componentRef){
        this.actionLayoutTemplate = componentRef.actionTemplate;
        this.pageTitleLayoutTemplate = componentRef.pageTitleTemplate;
    }
}