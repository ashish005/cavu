import {Component, Injector, OnDestroy, OnInit, TemplateRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
    templateUrl: './templates/layout.html'
})
export class OrgConfigSetupLayout {
  public navList: Array<any>;
  constructor(public injector: Injector, public router: Router, public activatedRoute: ActivatedRoute){
      this.navList = [
          {
              //id:'setting',
              key: `Setup`, isFLatChildren: false,
              children:[
                  { id:4, icon:"fa fa-dashboard", routeTo: 'general', key: `general`, sortOrder: 4 },
                  { id:4, icon:"fa fa-dashboard", routeTo: 'voucher-entry', key: `entry.name`, sortOrder: 4 },
                  { id:5, icon:"fa fa-dashboard", routeTo: 'invoice', key: `invoice.name`, sortOrder: 5 }
              ]
          }
      ];
  }
  onActivate(componentRef){}
}

@Component({
    standalone: false,
    templateUrl: './templates/layout.html'
})
export class OrgFeatureSetupLayout {
    public navList: Array<any>;
    constructor(public injector: Injector, public router: Router, public activatedRoute: ActivatedRoute){
        const { translatePath } = this.activatedRoute.snapshot.data;
        this.navList = [
            {
                //id:'setting',
                key: `Feature`, isFLatChildren: false,
                children:[
                    { id:4, icon:"fa fa-dashboard", routeTo: 'account', key: `account`, sortOrder: 4 },
                    { id:5, icon:"fa fa-dashboard", routeTo: 'inventory', key: `inventory`, sortOrder: 5 }
                ]
            }
        ];
    }
    onActivate(componentRef){}
}
