import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {TeamSetupService} from "../services/team.service";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {TeamUserGroup, TeamUserGroupQueryOptions} from "../domains/user-group.serializer";
import {TeamSetupAPIResolver} from "../services";

@Component({
  templateUrl: './layout.html'
})
export class TeamLayout extends ViewExtender<TeamUserGroup> implements OnInit{
  public actionTemplate: TemplateRef<any>;
  override coreState: TeamUserGroupQueryOptions = new TeamUserGroupQueryOptions();

  constructor(public router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: TeamSetupService,
              public apiResolver: TeamSetupAPIResolver){
      super(activatedRoute, service);
      this.gridOptions.header.edit = false;
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'name'},
          {headerName: 'Category', field: 'categoryName'},
          {headerName: 'Dynamic Rules', cellTemplate: GridUISwitchCellComponent },
          {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
      ];
  }

  ngOnInit(){ super.populateGrid(); }

  onActivate(componentRef){
    this.actionTemplate = componentRef.actionTemplate;
  }

  routeToUrl=(item)=> this.router.navigate([item.id, 'rules'], {relativeTo: this.activatedRoute});

    createNewTeam()
    {
        this.apiResolver.teamCreateEditPopup({ id: null }, { text: `Team Setup`, desc: 'Team' }, ()=>{
            super.populateGrid();
        });
    }
}
