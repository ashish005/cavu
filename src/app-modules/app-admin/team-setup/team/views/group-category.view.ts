import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ViewExtender} from "@app-global";
import {TeamService} from "../services";
import {Team, TeamQueryOptions} from "../domains/team.serializer";
import {TeamSetupAPIResolver} from "../services";
import {TeamUserGroup} from "../domains/user-group.serializer";

@Component({ templateUrl: './templates/group-category.html', styles: [':host { display: contents; }'] })
export class GroupCategoryView extends ViewExtender<Team> implements OnInit{
    @ViewChild('groupList', { static: true }) groupList;
    submitted: boolean;
    override coreState: TeamQueryOptions = new TeamQueryOptions();
    team: TeamUserGroup;
    constructor(public override service: TeamService,
                private apiResolver: TeamSetupAPIResolver,
                public override activatedRoute: ActivatedRoute)
    {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Phone', field: 'phone' },
            {headerName: 'Email', field: 'email' }
        ];
    }

    ngOnInit(){}
    searchRecord(data: TeamUserGroup)
    {
        this.team = data;
        this.coreState.teamId = data.id;
        super.populateGrid();
    }

    createNewTeam()
    {
        this.apiResolver.teamCreateEditPopup({ id: null }, { text: `Team Setup`, desc: 'Team' }, ()=>{
            this.groupList.populateGrid();
            super.populateGrid();
        });
    }
    editTeam(data)
    {
        const input = {
            id: data.id,
            data: data
        };
        this.apiResolver.teamCreateEditPopup(input, { text: `Edit: Team Setup`, desc: 'Team' }, ()=>{
            this.groupList.populateGrid();
            super.populateGrid();
        });
    }

    showUserFilters()
    {
        const input = {};
        this.apiResolver.showUserFilterTypePopup({}, {text: `User Filter Type`, desc: ''});
    }

}
