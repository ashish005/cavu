import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {
  NumberCell, ViewExtender,
    ASIDE_CLASS,
    ASIDE_SIZE,
    SharedService,
} from "@app-global";
import {Project, ProjectQueryOptions} from "../domains/project.serializer";
import {ProjectService} from "../services/project.service";
import {
    ProjectCustomerCell,
    ProjectDateInfoCell, ProjectManagerCell,
    ProjectNameActionCell
} from "../grid-cells/project-grid-cell.component";
import {ProjectCEComponent} from "../components";

@Component({
  standalone: false,
  templateUrl: './templates/manage.html'
})
export class ProjectManageView extends ViewExtender<Project> implements OnInit, OnDestroy
{
  //projectId: string;
  accountId: string;
  override coreState: ProjectQueryOptions = new ProjectQueryOptions();
  constructor(public override service: ProjectService,
              public sharedService: SharedService,
              public override activatedRoute: ActivatedRoute) {
      super(activatedRoute, service);
      const translate_path = 'modules.project.manage.grid';
      this.gridOptions.columnDefs = [
          {headerName: `${translate_path}.name`, field: 'name', cellTemplate: ProjectNameActionCell },
          {headerName: 'grid.header.customer', field: 'name', cellTemplate: ProjectCustomerCell },
          {headerName: 'grid.header.manager', field: 'name', cellTemplate: ProjectManagerCell },
          {headerName: `${translate_path}.type`, field: 'projectType' },
          {headerName: `${translate_path}.division`, field: 'division' },
          {headerName: `${translate_path}.billingType`, field: 'billingType' },
          {headerName: `${translate_path}.estimate`, cellTemplate: ProjectDateInfoCell },
          {headerName: `${translate_path}.approved`, field: 'approvedBudget', class: 'text-right', cellTemplate: NumberCell },
          {headerName: `${translate_path}.advance`, field: 'advanceAmount', class: 'text-right', cellTemplate: NumberCell },
          {headerName: `${translate_path}.expense`, field: 'expense', class: 'text-right', cellTemplate: NumberCell },
          {headerName: `${translate_path}.receipt`, field: 'receipt', class: 'text-right', cellTemplate: NumberCell },
          {headerName: `${translate_path}.due`, field: 'due', class: 'text-right', cellTemplate: NumberCell },
          {headerName: `${translate_path}.audit`, field: 'userAudit', class: 'float-right' }
      ];
  }

  ngOnInit(){
      //this.coreState.projectId = this.projectId;
    this.coreState.accountId = this.accountId;
    super.populateGrid();
  }

  override ngOnDestroy(){
    super.ngOnDestroy();
  }

  actionCb(row: Project){
      const inputData: any = {
          id: row.id,
          data: row
      };
      const popup = {
          header: {text: `${row.name}`, desc: '' },
          aside: ASIDE_CLASS.RIGHT,
          size: ASIDE_SIZE.W_50
      };
      this.showProjectCEPopup(inputData, {text: `${row.name}`, desc: '' }, ()=>{
          super.populateGrid();
      });
  }

  createNew(){
      const inputData: any = {
          id: null,
          data: {}
      };
      this.showProjectCEPopup(inputData, {text: 'New Project', desc: 'New Project is getting created' }, ()=> {
          super.populateGrid();
      });
  }

    showProjectCEPopup(inputData, popupHeader, cb){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(ProjectCEComponent, popup, inputData);
        modal$.then(success, failure);
    }

  showDetails(project){}
}

