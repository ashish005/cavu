import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {TeamSetupService} from "../services/team.service";
import {ASIDE_CLASS, ASIDE_SIZE, GridUISwitchCellComponent, SharedService, ViewExtender} from "@app-global";
import {TeamUserGroup, TeamUserGroupQueryOptions} from "../domains/user-group.serializer";
import {TeamSetupAPIResolver} from "../services";
import {TeamFilterTypeOptionsComponent} from "../components";

@Component({
    templateUrl: './templates/master-layout.html',
    standalone: false,
    styles: [`::ng-deep ng-component{ display: contents;}`]
})
export class Layout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                { routeTo: ['list-view'], icon:"fa fa-envelope", key: 'List' },
                { routeTo: ['manage'], icon:"fa fa-envelope", key: 'Grid' },
            ]
        }
    ];
    constructor(private sharedService: SharedService){}
    onActivate(componentRef: any){}

    showUserFilters() {
        const popupOptions = { header: {text: `User Filter Type`, desc: ''}, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_25 };
        const onSuccess = (resp)=> {this.sharedService.destroy();};
        const failure = (resp)=> {this.sharedService.destroy();};
        this.sharedService.showCustomPopup(TeamFilterTypeOptionsComponent, popupOptions, {}).then(onSuccess, failure);
    }
}

@Component({
    standalone: false,
  templateUrl: './templates/layout.html'
})
export class TeamLayout extends ViewExtender<TeamUserGroup> implements OnInit{
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
          {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
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

@Component({
    standalone: false,
    templateUrl: './templates/sub-layout.html'
})
export class TeamSubLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    isLoading: boolean = false;
    public viewNavigations: any = [
        { name: 'Setup Rules', sortOrder: 2, route: 'rules'},
        { name: 'Apply Rule', sortOrder: 4, route: 'records'}
    ];
    team: TeamUserGroup;
    constructor(public router: Router, public activatedRoute: ActivatedRoute,
                public service: TeamSetupService){
    }
    onActivate(componentRef){ this.actionTemplate = componentRef.actionTemplate; }

    ngOnInit(){
        this.activatedRoute.params.subscribe((parms: { teamId: string }) =>
        {
            this.populateTeam(parms.teamId);
        });
    }

    populateTeam(teamId){
        this.isLoading = true;
        const success=(resp)=> {
            this.team = resp.data;
            this.service.teamChangeEvent.next(resp.data);
            this.isLoading = false;
        };
        const error=()=> {
            this.isLoading = false;
        };
        this.service.read(teamId).toPromise().then(success, error);
    }
}
