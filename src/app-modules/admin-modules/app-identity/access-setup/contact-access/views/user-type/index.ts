import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";

import {UserTypeView} from "./views/user-type.view";
import {USERTYPE_MASTER_COMPONENTS} from "./components";
import {UserTypeService} from "./services/user-type.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { USERTYPE_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";

const MasterDocumentRoutes: Array<any> = [
  { path: '', component: UserTypeView, data: {title: 'master_type.modules.document.category.title'} }
];

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(MasterDocumentRoutes),
    GlobalModule
  ],
  declarations: [UserTypeView, USERTYPE_MASTER_COMPONENTS, USERTYPE_GRID_COLUMN_CELL_COMPONENTS],
  providers: [ UserTypeService ]
})

export class UserTypeModule{
  static forRoot(): ModuleWithProviders<UserTypeModule> {
    return { ngModule: UserTypeModule };
  }
  static forChild(): ModuleWithProviders<UserTypeModule> {
    return { ngModule: UserTypeModule };
  }
}
