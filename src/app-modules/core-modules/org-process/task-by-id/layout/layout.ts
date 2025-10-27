import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TaskAPIResolver, TaskByIdAPIResolver} from "../services/api.resolver";

@Component({ templateUrl: './templates/layout.html' })
export class TaskSideNavLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    taskId: string;

    public items : Array<any>;
    constructor(private router: Router, public activatedRoute: ActivatedRoute,
                public apiResolver: TaskAPIResolver, public resolver: TaskByIdAPIResolver
    )
    {
        const translatePath = this.activatedRoute.snapshot.data.translatePath;
        this.items = [
            { id:1, icon:"fa fa-dashboard", route: `dashboard`, key: `task-dashboard`, sortOrder: 1 },
            { id:2, icon:"fa fa-tag", route: `schedules`, key: `schedules`, sortOrder: 2 },
            { id:3, icon:"fa fa-tag", route: `reminder`, key: `reminder`, sortOrder: 3 }
        ];
    }

    ngOnInit(){ this.taskId = this.activatedRoute.snapshot.params.taskId; }

    goBack() { this.router.navigate(['../', 'manage'], {relativeTo: this.activatedRoute.parent}); }

    onActivate(componentRef){
        componentRef.taskId = this.taskId;
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    routerChange(nav){
        this.router.navigate([nav.route], { relativeTo: this.activatedRoute});
    }
}