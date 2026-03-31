import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({ standalone: false, templateUrl: './templates/fee-master.html' })
export class FeeMasterLayout implements OnInit {
  @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

  public isLoading: boolean = true;
  public actionTemplate: TemplateRef<any>;
  @Input() viewType;
  tabs: any = {
    'feeTax': 'feeTax',
    'concession': 'feeConcession',
    'feeType': 'feeType',
    'feePenalty': 'feePenalty'
  };
  loading: boolean = false;
  //activeTab: string;// = this.tabs.feeType;
  openTab(tab: string){ this.viewType = tab; }
  constructor(public activatedRoute: ActivatedRoute) {}

  ngOnInit() {}

  onActivate(componentRef){
    this.actionTemplate = componentRef.actionTemplate;
  }
}