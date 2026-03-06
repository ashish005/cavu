import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({ standalone: false, templateUrl: './templates/layout.html' })
export class StudentSubLayout implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    title:string;
    public viewNavigations: any = [
        { name: 'Info', sortOrder: 1, route: 'info'},
        { name: 'Address & Guardian', sortOrder: 2, route: 'address-guardian'},
        { name: 'Documents', sortOrder: 3, route: 'document'},
        { name: 'Batches', sortOrder: 4, route: 'batch'}
    ];
    constructor(public activatedRoute: ActivatedRoute)
    {
        //this.title = this.activatedRoute.snapshot.data.title;
        //this.apiResolver.moduleCode = activatedRoute.snapshot.data.code;

    }
    isNewForm: boolean = true;
    customForm: FormGroup;
    public componentRef: any;

    ngOnInit() {
        const param = this.activatedRoute.snapshot.params;
        const data = this.activatedRoute.snapshot.data;
    }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
    }
}
