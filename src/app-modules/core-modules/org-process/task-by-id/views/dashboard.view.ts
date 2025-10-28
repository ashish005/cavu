import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {TaskByIdAPIResolver} from "../services/api.resolver";

@Component({
    standalone: false,
  templateUrl: './templates/dashboard.html'
})
export class TaskDashboardView implements OnInit {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
  id: string;
    items: Array<any> = [];
    constructor(public activatedRoute: ActivatedRoute, public resolver: TaskByIdAPIResolver) {
    }

  ngOnInit(){
      this.id = this.resolver.data.id;
  }
}