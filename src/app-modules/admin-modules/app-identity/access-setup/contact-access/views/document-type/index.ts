import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";

import {DocumentTypeView} from "./views/document.view";
import {DocumentTypeService} from "./services/document-type.service";
import {DOCUMENT_MASTER_COMPONENTS} from "./components";
import {DocumentAccessAPIResolver} from "./services/api.resolver";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DOC_TYPE_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";

const MasterDocumentRoutes: Array<any> = [
  //{ path: '', pathMatch: 'full', redirectTo:'category' },
  { path: '', component: DocumentTypeView, resolve: { items: DocumentAccessAPIResolver }, data: {title: 'master_type.modules.document.category.title'} }
];

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(MasterDocumentRoutes),
    GlobalModule
  ],
  declarations: [DocumentTypeView, DOCUMENT_MASTER_COMPONENTS, DOC_TYPE_GRID_COLUMN_CELL_COMPONENTS],
  providers: [ DocumentAccessAPIResolver, DocumentTypeService]
})

export class DocumentMasterTypeModule{
  static forRoot(): ModuleWithProviders<DocumentMasterTypeModule> {
    return { ngModule: DocumentMasterTypeModule };
  }
  static forChild(): ModuleWithProviders<DocumentMasterTypeModule> {
    return { ngModule: DocumentMasterTypeModule };
  }
}
