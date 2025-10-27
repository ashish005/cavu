import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './layout.html'
})
export class TeamLayoutComponent implements OnInit{
  public actionTemplate: TemplateRef<any>;
  page: any;

  constructor(public activatedRoute: ActivatedRoute){
    this.page = this.activatedRoute.snapshot.data;
  }

  ngOnInit(){}

  onActivate(componentRef){
    this.actionTemplate = componentRef.actionTemplate;
  }
}
