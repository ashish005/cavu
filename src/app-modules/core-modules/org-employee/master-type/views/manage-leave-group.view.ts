import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {LeaveGroupService} from "../services";
import {LeaveGroup, LeaveGroupQueryOptions} from "../domains/leave-group.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/manage.html'
})
export class ManageLeaveGroupView extends ViewExtender<LeaveGroup> implements OnInit {
  override coreState: LeaveGroupQueryOptions = new LeaveGroupQueryOptions();
  constructor(public router: Router, public override activatedRoute: ActivatedRoute, public override service: LeaveGroupService) {
        super(activatedRoute, service);
        this.gridOptions.header = { title: 'Leave', desc: 'Leave', add: true, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    editRecord(row: any)
    {
        /*this.apiResolver.showEmployeeCEPopup({
            id: row.id,
            data: row
        }, { text: 'Update employee', desc: `Update employee` }, ()=> {
            super.populateGrid();
        });*/
    }
    createLeave()
    {
        /*this.apiResolver.showEmployeeCEPopup({
                id: null,
                data: null
            },
            { text: 'Create new employee', desc: `Create new employee` }, ()=>{
                super.populateGrid();
            });*/
    }

    actionCb(e){}
}
