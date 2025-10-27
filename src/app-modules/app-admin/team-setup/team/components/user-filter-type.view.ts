import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TeamSetupAPIResolver} from "../services/api.resolver";

@Component({ templateUrl: './templates/team-user-filter-type.html' })
export class TeamUserFilterTypeView implements OnInit {
  public userMasterTypeId: string;
  filterList: Array<any> = [];
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;

  constructor(public lookupResolver: TeamSetupAPIResolver) {
  }

  ngOnInit() {
      this.routeToUserTypeView(this.lookupResolver.masterType.userTypes[0]);
  }
    routeToUserTypeView(userType: any)
    {
      this.userMasterTypeId = userType?.id;
      this.filterList = this.lookupResolver.masterType.getFiltersByUserTypeId(this.userMasterTypeId);
    }
}
