import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";

@Component({
  standalone: false,
  templateUrl: './templates/dashboard.html',
  styles: [`:host {display: contents;}`]
})
export class DashboardView implements OnInit {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
  ngOnInit(){}
}
