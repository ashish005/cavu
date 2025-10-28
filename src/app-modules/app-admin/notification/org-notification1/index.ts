import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {RouterModule} from "@angular/router";
import {OrgNotificationAPIResolver, NotificationByIdResolver} from "./services/api.resolver";
import {NotificationService} from "./services/notification.service";
import { NOTIFICATION_VIEWS, NotificationRoutes } from "./notification.routing";
import {NOTIFICATION_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {NOTIFICATION_COMPONENT} from "./components";
import {GlobalModule} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(NotificationRoutes),
        GlobalModule
    ],
    declarations: [NOTIFICATION_VIEWS, NOTIFICATION_COMPONENT, NOTIFICATION_GRID_COLUMN_CELL_COMPONENTS],
    providers: [DatePipe, OrgNotificationAPIResolver, NotificationByIdResolver, NotificationService]
})
export class NotificationPermissionModule{}
