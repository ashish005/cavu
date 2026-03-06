import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {ActivatedRoute, Router} from "@angular/router";

@Component({ standalone: false, templateUrl: './templates/layout.html' })
export class StudentLayout implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  children = [
    { routeTo: ['info'], icon:"", name: "Organization" },
    { routeTo: ['batch-session'], icon:"", name: "Batch & Session" }
  ];
  title:string;
  constructor(public activatedRoute: ActivatedRoute){
    //this.title = this.activatedRoute.snapshot.data.title;
    //this.apiResolver.moduleCode = activatedRoute.snapshot.data.code;
  }
  ngOnInit(){}

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
    }
}
