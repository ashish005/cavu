import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {PostMaster, PostMasterQueryOptions} from "../domains/post.serializer";
import {PostMasterService} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/manage.html'
})
export class ManagePostView extends ViewExtender<PostMaster> implements OnInit {
  override coreState: PostMasterQueryOptions = new PostMasterQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: PostMasterService) {
        super(activatedRoute, service);
        this.gridOptions.header = { title: 'Post Types', desc: 'Post information here', add: true, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Role', field: 'userRole'},
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
