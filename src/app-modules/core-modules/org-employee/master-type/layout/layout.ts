import {Component, Injector, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

const getTranslationString = (key)=> `setup.mod.${key}.name`;
@Component({
  standalone: false,
    templateUrl: './layout.html'
})
export class MasterLayoutLayout {
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    public items: Array<any> = [
        {
            id:3, icon:"fa fa-dashboard", isHeading: true, name: "Setup Options", sortOrder: 3,
            children:
                [
                    { route: 'department', key: getTranslationString('emp.department'), sortOrder: 1},
                    { route: 'duty', key: getTranslationString('emp.duty'), sortOrder: 2},
                    { route: 'grade', key: getTranslationString('emp.grade'), sortOrder: 3},
                    { route: 'leave', key: getTranslationString('emp.leave'), sortOrder: 4},
                    { route: 'post', key: getTranslationString('emp.post'), sortOrder: 6}
                ]
        }
    ];
    public actionTemplate: TemplateRef<any>;
    constructor(public router: Router, public activatedRoute: ActivatedRoute){}

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
    }
}

@Component({
  standalone: false,
  templateUrl: './leave-layout.html'
})
export class MasterLeaveLayoutLayout {
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    public actionTemplate: TemplateRef<any>;
    constructor(public router: Router, public activatedRoute: ActivatedRoute){}

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
    }
}
