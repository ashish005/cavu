import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {UserTypeService} from "../services/user-type.service";
import {UserType, UserTypeQueryOptions} from "../domains/user-type.serializer";
import {UserTypeRuleCeComponent} from "../components/user-type.rule-ce.component";
import {UserTypeGridCellComponent} from "../grid-cells/user-type-grid-cell.component";

@Component({
    standalone: false,
    templateUrl: './templates/user-type.html'
})
export class UserTypeView extends ViewExtender<UserType> implements OnInit, OnDestroy {
  override coreState: UserTypeQueryOptions = new UserTypeQueryOptions();
  constructor(public override service: UserTypeService,
              public override activatedRoute: ActivatedRoute,
              private popupService: SharedService) {
    super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'name'},
          //{headerName: 'Account Group', field: 'accountGroupName'},
          {headerName: 'Roles', cellTemplate: UserTypeGridCellComponent },
          {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
      ];
  }

  ngOnInit() {
    super.populateGrid();
  }

  override ngOnDestroy(){
    super.ngOnDestroy();
  }

  actionCb(row: UserType){
    const inputData: any = { id: row.id, data: row };
    this.addUpdatePopup(inputData);
  }

  addRecord(){
    const inputData: any = { id: null, data: new UserType() };
    this.addUpdatePopup(inputData);
  }

  addUpdatePopup(inputData: any){
    const popup = {
      header: { text: `Rules for UserType`, desc: '' },
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

    let modal$ = this.popupService.showCustomPopup(UserTypeRuleCeComponent, popup, inputData);
    modal$.then(success, failure);
  }
}
