import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({ standalone: false, templateUrl: './templates/compliance-manage-ce.html' })
export class ComplianceManageCeLayout implements OnInit
{
  @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

  @ViewChild('compliance', { static: false }) public compliance;
  @ViewChild('detail', { static: false }) public detail;
  @ViewChild('schedule', { static: false }) public schedule;

  public isLoading: boolean = true;
  public actionTemplate: TemplateRef<any>;

  tabs: any = {
    'compliance': 'compliance',
    'schedule': 'schedule',
    'detail': 'detail'
  };
  @Input() viewType= this.tabs.compliance;
  openTab(tab: string){ this.viewType = tab; }

  @Input() id: any;
  @Input() data;
  constructor(public activatedRoute: ActivatedRoute) {}

  ngOnInit() {}

  onActivate(componentRef){
    this.actionTemplate = componentRef.actionTemplate;
  }
}