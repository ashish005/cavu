import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SESSION_COMPONENTS} from "./components";
import {SESSION_SERVICES} from "./services";
import {RouterModule, Routes} from "@angular/router";
import {SESSION_VIEWS, SessionSetupRoutes} from "./session.routing";
import {BATCH_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {GlobalModule} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(SessionSetupRoutes),
        GlobalModule
    ],
    providers: [SESSION_SERVICES],
    declarations: [ SESSION_VIEWS, SESSION_COMPONENTS, BATCH_GRID_COLUMN_CELL_COMPONENTS ],
})
export class SessionModule{}
