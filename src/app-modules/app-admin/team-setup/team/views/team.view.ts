import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {
    TeamUserGroup,
    TeamUserGroupQueryOptions
} from "../domains/user-group.serializer";
import {TeamSetupService} from "../services/team.service";
import {GroupListComponent} from "../components/group-list.component";

@Component({
  standalone: false,
  templateUrl: './templates/team.html'
})
export class TeamView extends ViewExtender<TeamUserGroup> implements OnInit, OnDestroy {
  public userMasterType: string;
  override coreState: TeamUserGroupQueryOptions = new TeamUserGroupQueryOptions();
  @ViewChild('groupCE', { static: true }) public groupCE;

  constructor(public override service: TeamSetupService,
              public override activatedRoute: ActivatedRoute,
              private sharedService: SharedService) {
    super(activatedRoute, service);
    const { userType } = this.activatedRoute.snapshot.data;
    this.userMasterType = userType;
      this.gridOptions.header.edit = false;
    this.gridOptions.columnDefs = [
        {headerName: 'Name', field: 'name'},
        {headerName: 'Category', field: 'categoryName'},
        {headerName: 'Dynamic Rules', cellTemplate: GridUISwitchCellComponent },
        {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
    ];
  }

  ngOnInit() {
    this.coreState.userMasterType = this.userMasterType;
    super.populateGrid();
  }

  override ngOnDestroy(){ super.ngOnDestroy(); }

  showGroup(group: TeamUserGroup) { this.groupCE.populateUserGroup(group); }
  groupUpdated(e) { super.populateGrid(); }

    showGroupCategory(){
        const popupHeaderOptions = { text: `Categories`, desc: '' };
        const onSuccess = (resp)=> {
            this.sharedService.destroy();
        };
        const onFailure = (resp)=> {
            this.sharedService.destroy();
        };

        const popupOptions = {
            header: popupHeaderOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_25
        };
        this.sharedService.showCustomPopup(GroupListComponent, popupOptions, null).then(onSuccess, onFailure);
    }
}
