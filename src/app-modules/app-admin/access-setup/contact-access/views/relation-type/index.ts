import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {RelationTypeView} from "./views/relation-type.view";
import {RELATION_TYPE_MASTER_COMPONENTS} from "./components";
import {RelationTypeService} from "./services/relation-type.service";
import {ReactiveFormsModule} from "@angular/forms";

const MasterDocumentRoutes: Array<any> = [
  { path: '', component: RelationTypeView, data: {title: 'master_type.modules.document.category.title'} }
];

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild(MasterDocumentRoutes),
    GlobalModule
  ],
  declarations: [RelationTypeView, RELATION_TYPE_MASTER_COMPONENTS],
  providers: [ RelationTypeService]
})

export class RelationMasterTypeModule{
  static forRoot(): ModuleWithProviders<RelationMasterTypeModule> {
    return { ngModule: RelationMasterTypeModule };
  }
  static forChild(): ModuleWithProviders<RelationMasterTypeModule> {
    return { ngModule: RelationMasterTypeModule };
  }
}
