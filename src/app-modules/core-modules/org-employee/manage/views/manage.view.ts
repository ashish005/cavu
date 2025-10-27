import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeNameActionCell} from "../grid-cell-component";
import {OrgEmployee, OrgEmployeeQueryOptions} from "../domains/org-employee.serializer";
import {UserAuditInfoCell, UserImageComponent, ViewExtender} from "@app-global";
import {FetchEmployeeService, OrgUserAPIResolver} from "../services";
import {EmployeeActionCell} from "../grid-cell-component/employee-grid-cell.component";

@Component({
  standalone: false,
  templateUrl: './templates/manage.html'
})
export class OrgEmployeeManageView extends ViewExtender<OrgEmployee> implements OnInit {
  override coreState: OrgEmployeeQueryOptions = new OrgEmployeeQueryOptions();
  constructor(public router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: FetchEmployeeService,
              public apiResolver: OrgUserAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: '', cellTemplate: UserImageComponent },
            {headerName: 'Name', field: 'name', cellTemplate: EmployeeNameActionCell },
            {headerName: '', cellTemplate: EmployeeActionCell },
            {headerName: 'Gender', field: 'gender' },
            {headerName: 'Nationality', field: 'nationality' },
            {headerName: 'Blood Group', field: 'bloodGroup' },
            {headerName: 'Post', field: 'post' },
            {headerName: 'Duty Type', field: 'dutyType' },
            {headerName: 'Audit', field: 'userAudit', class: 'float-right text-right', cellTemplate: UserAuditInfoCell }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    actionCb(row: any)
    {
        this.apiResolver.showEmployeeCEPopup({
            id: row.id,
            data: row
        }, { text: 'Update employee', desc: `Update employee` }, ()=> {
            super.populateGrid();
        });
    }
    createEmployee()
    {
        this.apiResolver.showEmployeeCEPopup({
            id: null,
            data: null
        },
            { text: 'Create new employee', desc: `Create new employee` }, ()=>{
            super.populateGrid();
        });
    }
}
