import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
  templateUrl: './layout.html',
  styles: [':host ::ng-deep { display: contents; }']
})
export class StudentFeeLayout implements OnInit {
  reportViewTypes: Array<any> = [
      { id: 1, icon: "", name: "Default", key:'viewType', code:'student', route: ['report'] },
      { id: 2, icon: "", name: "Class View", key:'viewType', code:'class', route: ['class'] },
      { id: 4, icon: "", name: "Class Section View", key:'viewType', code:'class-section', route: ['class-section'] },
      { id: 4, icon: "", name: "Fee Head View", key:'viewType', code:'head', route: ['head'] },
      { id: 4, icon: "", name: "Batch View", key:'viewType', code:'batch', route: ['batch'] },
  ];
  activeReportView: { id: number, icon: string, name: string, code: string } = this.reportViewTypes[0];
  public actionTemplate: TemplateRef<any>;
  public routerActionTemplate: TemplateRef<any>;
  public title: string;
  constructor(private router: Router, public activatedRoute: ActivatedRoute)
  {
      //this.title = this.activatedRoute.snapshot.data.header;
  }

  ngOnInit(){}

  updateReportViewType(viewType) {
    this.activeReportView = viewType;
    this.router.navigate(viewType.route, {relativeTo: this.activatedRoute.parent});
  }

  onActivate(componentRef){
    this.routerActionTemplate = componentRef.routerActionTemplate;
    this.actionTemplate = componentRef.actionTemplate;
  }
}