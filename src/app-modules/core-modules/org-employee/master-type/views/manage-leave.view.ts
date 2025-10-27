import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender} from "@app-global";
import {LeaveType, LeaveTypeQueryOptions} from "../domains/leave-type.serializer";
import {LeaveTypeService} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/manage-leave.html'
})
export class ManageLeaveView extends ViewExtender<LeaveType> implements OnInit {
  override coreState: LeaveTypeQueryOptions = new LeaveTypeQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: LeaveTypeService) {
        super(activatedRoute, service);
        this.gridOptions.header = { title: 'Leave', desc: 'Leave', add: true, refresh: true, edit: true, delete: false };
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
}
