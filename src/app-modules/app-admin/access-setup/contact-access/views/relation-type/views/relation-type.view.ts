import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ASIDE_CLASS, ASIDE_SIZE, SharedService, GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {RelationTypeService} from "../services/relation-type.service";
import {RelationType, RelationTypeQueryOptions} from "../domains/relation-type.serializer";
import {RelationTypeCeComponent} from "../components/relation-type-ce.component";

@Component({ templateUrl: './templates/relation-type.html' })
export class RelationTypeView extends ViewExtender<RelationType> implements OnInit, OnDestroy {
  public userMasterType: string;
  override coreState: RelationTypeQueryOptions = new RelationTypeQueryOptions();
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;

  constructor(public override service: RelationTypeService,
              public override activatedRoute: ActivatedRoute,
              private popupService: SharedService) {
    super(activatedRoute, service);
      this.userMasterType = this.activatedRoute.snapshot.data.userType;
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'name'},
          {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
      ];
  }

  ngOnInit() {
    this.coreState.userMasterType = this.userMasterType;
    super.populateGrid();
  }

  ngOnDestroy(){
    super.ngOnDestroy();
  }

  actionCb(row: RelationType){
    const inputData: any = { id: row.id, data: row };
    this.addUpdatePopup(inputData);
  }

  addRecord(){
    const inputData: any = { id: null, data: new RelationType() };
    this.addUpdatePopup(inputData);
  }

  addUpdatePopup(inputData: any){
    const popup = {
      header: { text: `Rules for Document`, desc: '' },
      aside: ASIDE_CLASS.RIGHT,
      size: ASIDE_SIZE.W_50
    };

    const success = (resp: any)=>{
      this.popupService.destroy();
        super.populateGrid();
    };
    const failure = (e)=>{
      this.popupService.destroy();
    };

    let modal$ = this.popupService.showCustomPopup(RelationTypeCeComponent, popup, inputData);
    modal$.then(success, failure);
  }
}
