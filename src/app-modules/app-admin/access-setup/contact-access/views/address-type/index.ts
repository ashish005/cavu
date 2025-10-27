import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";

import {AddressTypeService} from "./services/address-type.service";
import {AddressTypeView} from "./views/address-type.view";
import {ADDRESS_MASTER_COMPONENTS} from "./components";

const MasterDocumentRoutes: Array<any> = [
  //{ path: '', pathMatch: 'full', redirectTo:'category' },
  { path: '', component: AddressTypeView, data: {title: 'master_type.modules.document.category.title'} }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MasterDocumentRoutes),
    GlobalModule
  ],
  declarations: [AddressTypeView, ADDRESS_MASTER_COMPONENTS],
  providers: [ AddressTypeService]
})

export class AddressMasterTypeModule{
  static forRoot(): ModuleWithProviders<AddressMasterTypeModule> {
    return { ngModule: AddressMasterTypeModule };
  }
  static forChild(): ModuleWithProviders<AddressMasterTypeModule> {
    return { ngModule: AddressMasterTypeModule };
  }
}
