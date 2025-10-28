import {Component, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, ViewExtender} from "@app-global";
import {DashboardPortletService} from "../services/dashboard-portlet.service";
import {DashboardPortlet, DashboardPortletQueryOptions} from "../domains/dashboard-portlet.serializer";
import {DashboardPortletRuleComponent} from "../components/dashboard-portlet.rule.component";

@Component({
    standalone: false,
    templateUrl: './templates/dashboard.html'
})
export class DashboardPortletView extends ViewExtender<DashboardPortlet> implements OnInit, OnDestroy {
  userMasterType: string;
  override coreState: DashboardPortletQueryOptions = new DashboardPortletQueryOptions();
  constructor(public override service: DashboardPortletService,
              public override activatedRoute: ActivatedRoute,
              private sharedService: SharedService) {
    super(activatedRoute, service);
    //this.userMasterType = this.activatedRoute.snapshot.data.userType;
    this.gridOptions.columnDefs = [
      {headerName: 'Name', field: 'name' },
      {headerName: 'Sort Order', field: 'sortOrder' },
      {headerName: 'Visible', field: 'isVisible' },
      {headerName: 'Created Date', field: 'createdDate'},
      {headerName: 'modified Date', field: 'modifiedDate'},
    ];
  }

  ngOnInit(){
    (<DashboardPortletQueryOptions>this.coreState).userMasterType = this.userMasterType;
    super.populateGrid();
  }

  override ngOnDestroy(){
      super.ngOnDestroy();
  }

   actionCb(row: DashboardPortlet){
    const { id, name } = row;
    const popup = {
      header: { text: `${name}`, desc: '' },
      aside: ASIDE_CLASS.RIGHT,
      size: ASIDE_SIZE.W_50
    };

    const inputData = {
      id: id,
      data: row
    };

    const success = (resp: any)=>{
      this.sharedService.destroy();
      super.populateGrid();
    };
    const failure = (e)=>{
      this.sharedService.destroy();
    };

    let modal$ = this.sharedService.showCustomPopup(DashboardPortletRuleComponent, popup, inputData);
    modal$.then(success, failure);
  }
}
