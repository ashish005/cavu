import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";

import {ContactTypeView} from "./views/contact-type.view";
import {CONTACT_MASTER_COMPONENTS} from "./components";
import {ContactTypeService} from "./services/contact-type.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CONTACT_TYPE_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";

const MasterDocumentRoutes: Array<any> = [
  { path: '', component: ContactTypeView, data: {title: 'master_type.modules.document.category.title'} }
];

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(MasterDocumentRoutes),
    GlobalModule
  ],
  declarations: [ContactTypeView, CONTACT_MASTER_COMPONENTS, CONTACT_TYPE_GRID_COLUMN_CELL_COMPONENTS],
  providers: [ ContactTypeService ]
})

export class ContactMasterTypeModule{
  static forRoot(): ModuleWithProviders<ContactMasterTypeModule> {
    return { ngModule: ContactMasterTypeModule };
  }
  static forChild(): ModuleWithProviders<ContactMasterTypeModule> {
    return { ngModule: ContactMasterTypeModule };
  }
}
