import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  templateUrl: './templates/role-permission-manager.html',
  styles: [':host { display: contents; }']
})
export class RolePermissionManager implements OnInit {
  showPermissionUpdateButton: boolean = true;
  showNew: boolean = true;
  singleRole: boolean = true;
  module = "Permission";

  isViewOnlyScreen: boolean = false;
  constructor(private activeRoute: ActivatedRoute) {

  }

  ngOnInit(){
    //this.isViewOnlyScreen = this.activeRoute.parent.snapshot.data.isViewOnlyScreen
  }

  rpManagerCallback(data){}
}