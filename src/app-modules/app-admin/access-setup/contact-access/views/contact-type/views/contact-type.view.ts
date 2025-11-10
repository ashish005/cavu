import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {ContactTypeService} from "../services/contact-type.service";
import {ContactType, ContactTypeQueryOptions} from "../domains/contact-type.serializer";
import {ContactTypeRuleCeComponent} from "../components/contact-type.rule-ce.component";

@Component({
    standalone: false,
    templateUrl: './templates/contact-type.html'
})
export class ContactTypeView extends ViewExtender<ContactType> implements OnInit, OnDestroy {
  override coreState: ContactTypeQueryOptions = new ContactTypeQueryOptions();
  constructor(public override service: ContactTypeService,
              public override activatedRoute: ActivatedRoute,
              private popupService: SharedService) {
    super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'name'},
          {headerName: 'Mandatory', field: 'isMandatory', cellTemplate: GridUISwitchCellComponent},
          {headerName: 'VerificationRequired', field: 'isVerificationRequired', cellTemplate: GridUISwitchCellComponent },
          {headerName: 'Verification By', field: 'verificationByUserName' },
          {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
      ];
  }

  ngOnInit() {
    super.populateGrid();
  }

  override ngOnDestroy(){
    super.ngOnDestroy();
  }

  actionCb(row: ContactType){
    const inputData: any = { id: row.id, data: row };
    this.addUpdatePopup(inputData);
  }

  addRecord(){
    const inputData: any = { id: null, data: new ContactType() };
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

    let modal$ = this.popupService.showCustomPopup(ContactTypeRuleCeComponent, popup, inputData);
    modal$.then(success, failure);
  }
}
