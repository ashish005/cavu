import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({ templateUrl: './layout.html' })
export class ConfigLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;

    pageTitle: string;
    constructor(public activatedRoute: ActivatedRoute, private router: Router){
        const { title } = this.activatedRoute.snapshot.data;
        this.pageTitle = title;
    }

    public items: Array<any> = [
        {
            id:1, icon:"fa fa-dashboard", isHeading: true, name: "Main", sortOrder: 3,
            children: [
                { id:2, icon:"fa fa-dashboard", route: 'frequency', name: "Frequency", sortOrder: 1 },
                { id:3, icon:"fa fa-dashboard", route: 'phase', name: "Process Phase", sortOrder: 1 },
                { id:4, icon:"fa fa-dashboard", route: 'task-priority', name: "Task Priority", sortOrder: 1 },
                { id:5, icon:"fa fa-dashboard", route: 'task-status', name: "Task Status", sortOrder: 1 }
            ]
        }
    ];

    ngOnInit(){}

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}