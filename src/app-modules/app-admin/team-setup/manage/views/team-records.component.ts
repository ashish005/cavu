import {ActivatedRoute} from "@angular/router";
import {Component, OnInit, ViewChild} from "@angular/core";
import {ViewExtender} from "@app-global";
import {Team, TeamQueryOptions} from "../domains/team.serializer";
import {TeamUserGroup} from "../domains/user-group.serializer";
import {TeamUserRecordsService} from "../services/team.service";

@Component({
    standalone: false,
    templateUrl: './templates/team-records.html',
    styles: [':host { display: contents; }']
})
export class TeamRecordsComponent extends ViewExtender<Team> implements OnInit{
    teamId: string;
    override coreState: TeamQueryOptions = new TeamQueryOptions();
    team: TeamUserGroup;
    constructor(public override service: TeamUserRecordsService,
                public override activatedRoute: ActivatedRoute)
    {
        super(activatedRoute, service);
        const { teamId } = this.activatedRoute.parent.snapshot.params;
        this.teamId = teamId;
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Phone', field: 'phone' },
            {headerName: 'Email', field: 'email' }
        ];
    }

    ngOnInit(){
        this.coreState.teamId = this.teamId;
        super.populateGrid();
    }
    searchRecord(data: TeamUserGroup)
    {
        this.team = data;
        this.coreState.teamId = data.id;
        super.populateGrid();
    }

    /*createNewTeam()
    {
        this.apiResolver.teamCreateEditPopup({ id: null }, { text: `Team Setup`, desc: 'Team' }, ()=>{
            this.groupList.populateGrid();
            this.populateGrid();
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
            this.populateGrid();
        });
    }

    showUserFilters()
    {
        const input = {};
        this.apiResolver.showUserFilterTypePopup({}, {text: `User Filter Type`, desc: ''});
    }*/
    actionCb(e){}
}
