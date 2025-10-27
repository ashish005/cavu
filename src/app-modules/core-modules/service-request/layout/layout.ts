import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SupportTicketQueryOptions} from "../domains/support.domain";

@Component({
  standalone: false,
  templateUrl: './layout.html'
})
export class ServiceRequestLayoutComponent implements OnInit {
  @ViewChild('routerActionTemplate', { static: true }) public routerActionTemplate: TemplateRef<any>;
  title: string;
  queryOptions: SupportTicketQueryOptions;
  constructor(public activatedRoute: ActivatedRoute){
    this.queryOptions = new SupportTicketQueryOptions();
  }

  ngOnInit(){}

  onActivate(componentRef){
    this.routerActionTemplate = componentRef.routerActionTemplate;
  }
}
