import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, GridUISwitchCellComponent, ViewExtender} from  "@app-global";
import {
    TeamUserGroup,
    TeamUserGroupQueryOptions
} from "../domains/user-group.serializer";
import {TeamSetupService} from "../services/team.service";
import {GroupListComponent} from "../components/group-list.component";

@Component({
  standalone: false,
  templateUrl: './templates/user-group.html'
})
export class UserGroupView extends ViewExtender<TeamUserGroup> implements OnInit, OnDestroy {
    public viewNavigations: any = [
        { name: 'Process', sortOrder: 2, route: 'all'},
        { name: 'Tasks', sortOrder: 3, route: 'task'},
        { name: 'Scheduled Tasks', sortOrder: 4, route: 'scheduled'}
    ];
  public userMasterType: string;
  override coreState: TeamUserGroupQueryOptions = new TeamUserGroupQueryOptions();
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  @ViewChild('groupCE', { static: true }) public groupCE;

  constructor(public override service: TeamSetupService,
              public override activatedRoute: ActivatedRoute, private sharedService: SharedService) {
    super(activatedRoute, service);
    this.gridOptions.header.edit = false;
    this.userMasterType = this.activatedRoute.snapshot.data.userType;
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

  ngOnDestroy(){ super.ngOnDestroy(); }

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
