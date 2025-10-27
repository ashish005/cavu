import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GlobalModule} from "@app-global";
import {RouterModule} from "@angular/router";
import {ORG_USER_VIEWS, OrgUserRoutes} from "./manage.routing";
import {FetchEmployeeService, OrgUserAPIResolver, OrgUserDocumentService} from "./services";
import {GRID_CELL_COMPONENTS} from "./grid-cell-component";
import {ORG_EMPLOYEE_COMPONENT} from "./components";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(OrgUserRoutes),
        GlobalModule
    ],
    providers: [OrgUserAPIResolver, FetchEmployeeService, OrgUserDocumentService],
    declarations: [ORG_USER_VIEWS, GRID_CELL_COMPONENTS, ORG_EMPLOYEE_COMPONENT]
})
export class OrgEmployeeManageModule{}
