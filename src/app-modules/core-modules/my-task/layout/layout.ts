import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MyTaskAPIResolver} from "../services/api.resolver";

@Component({
  standalone: false,
  templateUrl: './layout.html'
})
export class MyTaskLayout implements OnInit {
  public actionTemplate: TemplateRef<any>;
  page: any;
  viewNavigations = {
    'task': [
        /*{ name: 'Assigned To Me', sortOrder: 1, route: 'assigned'},
        { name: 'Reported To Me', sortOrder: 2, route: 'reported'},
        { name: 'Verified By Me', sortOrder: 3, route: 'verified'},*/
        //{ name: 'My Tasks', sortOrder: 4, route: 'org'},
        { name: 'Schedules', sortOrder: 5, route: 'scheduled'},
        { name: 'History', sortOrder: 5, route: 'task-log'}
    ]
  };

    menuItems: Array<any> = [
        { name: 'List', sortOrder: 2, route: 'list', icon: 'fa-list'},
        { name: 'Board', sortOrder: 3, route: 'board', icon: 'fa-table'},
        { name: 'Calendar', sortOrder: 4, route: 'calendar', icon: 'fa-calendar'},
    ];
  constructor(private router: Router, public activatedRoute: ActivatedRoute, public lookupResolver: MyTaskAPIResolver) {
      this.page = this.activatedRoute.snapshot.data;
  }
  onActivate(componentRef){
    this.actionTemplate = componentRef.actionTemplate;
  }

  addRecord(){}
  //showData(row: OrgProcess) { this.lookupResolver.changeOrgProcess(row); }

  ngOnInit(){}

  showData(item){this.router.navigate(['org',item.route], {relativeTo: this.activatedRoute});}
}
