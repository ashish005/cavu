import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {CLASS_VIEWS, ClassRoutes} from "./class.routing";
import {CLASS_COMPONENTS} from "./components";
import {OrgClassService} from "./services/class.service";
import {OrgClassModuleAPIResolver} from "./services/api-resolver.service";
import {StudyBoardTypeService, StudyModeTypeService} from "./services/study.service";
import {CLASS_GRID_CELL_COMPONENTS} from "./grid-cell";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild(ClassRoutes),
        GlobalModule
    ],
    declarations: [CLASS_VIEWS, CLASS_COMPONENTS, CLASS_GRID_CELL_COMPONENTS],
    providers: [OrgClassModuleAPIResolver, OrgClassService, StudyBoardTypeService, StudyModeTypeService]
})

export class ClassManageModule{}
