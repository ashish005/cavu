import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";

import {ContactTypeView} from "./views/contact-type.view";
import {CONTACT_MASTER_COMPONENTS} from "./components";
import {ContactTypeService} from "./services/contact-type.service";

const MasterDocumentRoutes: Array<any> = [
  { path: '', component: ContactTypeView, data: {title: 'master_type.modules.document.category.title'} }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MasterDocumentRoutes),
    GlobalModule
  ],
  declarations: [ContactTypeView, CONTACT_MASTER_COMPONENTS],
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
