import {Component, OnInit, TemplateRef} from '@angular/core';
import {PayoutPlanLookupService} from "../services/api.resolver";
import {ActivatedRoute} from "@angular/router";

@Component({
  templateUrl: './layout.html',
  styles: [':host ::ng-deep { display: contents; }'],
  standalone: false
})
export class PayoutLayout implements OnInit {
  public actionTemplate: TemplateRef<any>;
  public pageTitleTemplate: TemplateRef<any>;
  public title: string;
  constructor(public apiResolver: PayoutPlanLookupService, private activatedRoute: ActivatedRoute){
      this.title = this.activatedRoute.snapshot.data['title'];
  }

  ngOnInit(){}

  onActivate(componentRef){
    this.pageTitleTemplate = componentRef.pageTitleTemplate;
    this.actionTemplate = componentRef.actionTemplate;
  }
}
