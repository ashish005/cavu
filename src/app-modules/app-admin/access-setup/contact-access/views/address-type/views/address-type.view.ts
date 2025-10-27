import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { GridUISwitchCellComponent, ASIDE_CLASS, ASIDE_SIZE, SharedService, ViewExtender } from "@app-global";
import {AddressType, AddressTypeQueryOptions} from "../domains/address-type.serializer";
import {AddressTypeService} from "../services/address-type.service";
import {AddressTypeRuleCeComponent} from "../components/address-type.rule-ce.component";

@Component({ templateUrl: './templates/address-type.html' })
export class AddressTypeView extends ViewExtender<AddressType> implements OnInit, OnDestroy {
  public userMasterType: string;
  override coreState: AddressTypeQueryOptions = new AddressTypeQueryOptions();
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;

  constructor(public override service: AddressTypeService,
              public override activatedRoute: ActivatedRoute,
              private popupService: SharedService) {
    super(activatedRoute, service);
      this.userMasterType = this.activatedRoute.snapshot.data.userType;
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'name'},
          {headerName: 'Mandatory', field: 'isMandatory', cellTemplate: GridUISwitchCellComponent },
          {headerName: 'VerificationRequired', field: 'isVerificationRequired', cellTemplate: GridUISwitchCellComponent },
          {headerName: 'Verification By', field: 'verificationByUserName' },
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

  actionCb(row: AddressType){
    const inputData: any = { id: row.id, data: row };
    this.addUpdatePopup(inputData);
  }

  addRecord(){
    const inputData: any = { id: null, data: new AddressType() };
    this.addUpdatePopup(inputData);
  }

  addUpdatePopup(inputData: any){
    const popup = {
      header: { text: `Rules for Address Type`, desc: '' },
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

    let modal$ = this.popupService.showCustomPopup(AddressTypeRuleCeComponent, popup, inputData);
    modal$.then(success, failure);
  }
}
