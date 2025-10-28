import {Component, Injector, OnDestroy, OnInit, TemplateRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs";

/*@Component({
  template: `<router-outlet (activate)='onActivate($event)'></router-outlet>`,
  styles: [`::ng-deep ng-component{ display: contents;}`]
})*/
@Component({
    standalone: false,
    templateUrl: './templates/layout.html'
})
export class OrgSetupLayout implements OnInit, OnDestroy {
  public navList: Array<any>;
  constructor(public injector: Injector, public router: Router, public activatedRoute: ActivatedRoute){
      const { translatePath } = this.activatedRoute.snapshot.data;
      this.navList = [
          {
              //id:'setting',
              key: `${translatePath}.org.name`, isFLatChildren: false,
              children:[
                  { id:1, icon:"fa fa-university", routeTo: ['org/info'], key: `${translatePath}.org.info.name`, sortOrder: 1 },
                  { id:3, icon:"fa fa-university", routeTo: 'org/host', key: `${translatePath}.org.host.name`, sortOrder: 2 },
                  { id:4, icon:"fa fa-university", routeTo: 'org/branch', key: `${translatePath}.org.branch.name`, sortOrder: 3 },
                  { id:5, icon:"fa fa-university", routeTo: 'org/language', key: `Language`, sortOrder: 4 },
                  { id:6, icon:"fa fa-university", routeTo: 'org/currency', key: `Currency`, sortOrder: 5 },
                  { id:4, icon:"fa fa-dashboard", routeTo: 'org/config', key: `Configuration`, sortOrder: 6 }
              ]
          },
          {
              //id:'setting',
              key: `Setup`, isFLatChildren: false,
              children:[

                  { id:4, icon:"fa fa-dashboard", routeTo: 'config/voucher-entry', key: `${translatePath}.config.entry.name`, sortOrder: 4 },
                  { id:5, icon:"fa fa-dashboard", routeTo: 'config/invoice', key: `${translatePath}.config.invoice.name`, sortOrder: 5 }
              ]
          },
          {
              //id:'setting',
              key: `${translatePath}.feature.name`, isFLatChildren: false,
              children:[
                  { id:4, icon:"fa fa-dashboard", routeTo: 'feature/account', key: `${translatePath}.feature.account.name`, sortOrder: 4 },
                  { id:5, icon:"fa fa-dashboard", routeTo: 'feature/inventory', key: `${translatePath}.feature.inventory.name`, sortOrder: 5 }
              ]
          }
      ];
  }

  ngOnInit() { }
  onActivate(componentRef){}
  ngOnDestroy() { }
}
