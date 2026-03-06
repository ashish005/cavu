import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrgClassModuleAPIResolver} from "../services/api-resolver.service";

@Component({ standalone: false, templateUrl: './templates/layout.html' })
export class LayoutComponent implements OnInit{
  public actionTemplate: TemplateRef<any>;

  constructor(public router: Router, private activatedRoute: ActivatedRoute,
              public apiResolver: OrgClassModuleAPIResolver){
  }

  onActivate(componentRef){
    this.actionTemplate = componentRef.actionTemplate;
  }

  ngOnInit(){}

  showAllModes(e){
    const inputData: any = {
      id: null,
      data: null
    };
    this.apiResolver.showAllModes(inputData, {text: 'Study Types', desc: 'Current applied Organization Study Types' });
  }

    onStudyModeChange(level){
      this.router.navigate(['mode', level.id], {  relativeTo: this.activatedRoute });
    }
}

