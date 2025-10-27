import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {GradeMasterService} from "../services";
import {GradeMaster, GradeMasterQueryOptions} from "../domains/grade.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/manage.html'
})
export class ManageGradeView extends ViewExtender<GradeMaster> implements OnInit {
  override coreState: GradeMasterQueryOptions = new GradeMasterQueryOptions();
  constructor(public router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: GradeMasterService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: 'Grade', desc: 'Grade information here', add: true, refresh: true, edit: true, delete: false };
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
