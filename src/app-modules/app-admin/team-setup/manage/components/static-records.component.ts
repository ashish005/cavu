import {ActivatedRoute} from "@angular/router";
import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ViewExtender} from "@app-global";
import {Team, TeamQueryOptions} from "../domains/team.serializer";
import {MappedUserRecordService} from "../services/team.service";
@Component({
    standalone: false,
    templateUrl: './templates/static-record.html',
    styles: [':host { display: contents; }']
})
export class StaticRecordsComponent extends ViewExtender<Team> implements OnInit{
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    @Input() id: number;
    override coreState: TeamQueryOptions = new TeamQueryOptions();
    constructor(public override service: MappedUserRecordService,
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

    ngOnInit(){
        debugger
        this.coreState.teamId = this.id;
        super.populateGrid();
    }
    actionCb(e){}
}
