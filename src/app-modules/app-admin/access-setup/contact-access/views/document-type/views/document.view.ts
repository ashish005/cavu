import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, ViewExtender, GridUISwitchCellComponent } from "@app-global";
import { DocumentTypeRuleCeComponent } from "../components/document-type.rule-ce.component";
import { DocumentTypeService } from "../services/document-type.service";
import { DocumentTypeQueryOptions } from "../domains/document-type.serializer";
import {DocumentAccessAPIResolver} from "../services/api.resolver";
import {DocumentCategoryLookup} from "../domains/lookup";
import {DocumentType} from "../domains/document-type.serializer";
import {DocTypeCellComponent} from "../grid-cells/doc-type-grid-cell.component";

@Component({
  standalone: false,
  templateUrl: './templates/document.html'
})
export class DocumentTypeView extends ViewExtender<DocumentType> implements OnInit, OnDestroy {
  override coreState: DocumentTypeQueryOptions = new DocumentTypeQueryOptions();
  constructor(public override service: DocumentTypeService,
              public override activatedRoute: ActivatedRoute,
              private popupService: SharedService, public lookupResolver: DocumentAccessAPIResolver) {
    super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'name'},
          {headerName: 'Category', field: 'categoryName'},
          {headerName: 'User Type', cellTemplate: DocTypeCellComponent },
          {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
      ];
  }

  ngOnInit() {
    super.populateGrid();
  }

  override ngOnDestroy(){
    super.ngOnDestroy();
  }

    showDetails(item: DocumentCategoryLookup){
      this.coreState.categoryId = item.id;
      super.populateGrid();
    }

  actionCb(row: DocumentType){
    const inputData: any = { id: row.id, data: row };
    this.addUpdatePopup(inputData);
  }

  addRecord(){
    const inputData: any = { id: null, data: new DocumentType() };
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

    let modal$ = this.popupService.showCustomPopup(DocumentTypeRuleCeComponent, popup, inputData);
    modal$.then(success, failure);
  }
}
