import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {DepartmentMasterService} from "../services";
import {DepartmentMaster, DepartmentMasterQueryOptions} from "../domains/department.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/manage.html'
})
export class ManageDepartmentView extends ViewExtender<DepartmentMaster> implements OnInit {
  override coreState: DepartmentMasterQueryOptions = new DepartmentMasterQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: DepartmentMasterService) {
        super(activatedRoute, service);
        this.gridOptions.header = { title: 'Departments', desc: 'Departments', add: true, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    actionCb(row: any)
    {
        /*this.apiResolver.showEmployeeCEPopup({
            id: row.id,
            data: row
        }, { text: 'Update employee', desc: `Update employee` }, ()=> {
            super.populateGrid();
        });*/
    }
    createEmployee()
    {
        /*this.apiResolver.showEmployeeCEPopup({
                id: null,
                data: null
            },
            { text: 'Create new employee', desc: `Create new employee` }, ()=>{
                super.populateGrid();
            });*/
    }
}
