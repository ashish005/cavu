import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {TaskByIdAPIResolver} from "../services/api.resolver";

@Component({
  templateUrl: './templates/dashboard.html'
})
export class TaskDashboardView implements OnInit {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
  id: string;
    pageTitle: string;
    pageIcon: string;
    items: Array<any> = [];
    constructor(public activatedRoute: ActivatedRoute, public resolver: TaskByIdAPIResolver) {
        const { data, parent} = this.activatedRoute.snapshot;
        this.pageTitle = data.title || parent?.data?.title;
        this.pageIcon = data.icon || parent?.data?.icon;
    }

  ngOnInit(){
      this.id = this.resolver.data.id;
  }
}