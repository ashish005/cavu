import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ViewExtender} from "@app-global";
import {TeamUserGroup, TeamUserGroupQueryOptions} from "../domains/user-group.serializer";
import {TeamSetupService} from "../services/team.service";
import {TeamRuleCellComponent} from "../grid-cells/team-grid.cell";
import {TeamSetupAPIResolver} from "../services";

@Component({
    standalone: false,
    templateUrl: './templates/team.html',
    styles: [':host { display: contents; }']
})
export class TeamView extends ViewExtender<TeamUserGroup> implements OnInit{
    submitted: boolean;
    override coreState: TeamUserGroupQueryOptions = new TeamUserGroupQueryOptions();
    constructor(public override service: TeamSetupService,
                public override activatedRoute: ActivatedRoute,
                public apiResolver: TeamSetupAPIResolver)
    {
        super(activatedRoute, service);
        //this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Category', field: 'categoryName' },
            {headerName: 'UserType', field: 'userMasterTypeName' },
            {headerName: 'Dynamic Rules', field: 'hasDynamicRules' },
            {headerName: 'Rules', field: 'totalRules', cellTemplate: TeamRuleCellComponent },
            {headerName: 'Status', field: 'status' }
        ];
    }
    ngOnInit(){ this.populateGrid(); }

    createNewTeam()
    {
        this.apiResolver.teamCreateEditPopup({ id: null }, { text: `Team Setup`, desc: 'Team' }, ()=>{
            this.populateGrid();
        });
    }

    actionCb(data: TeamUserGroup)
    {
        const input = {
            id: data.id,
            data: data
        };
        this.apiResolver.teamCreateEditPopup(input, { text: `Edit: Team Setup`, desc: 'Team' }, ()=>{
            this.populateGrid();
        });
    }
}
