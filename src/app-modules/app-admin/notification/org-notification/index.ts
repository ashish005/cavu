import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {NotificationAPIResolver} from "./services/api.resolver";
import {NotificationService} from "./services/notification.service";
import {NOTIFICATION_COMPONENT} from "./components";
import { NOTIFICATION_VIEWS, NotificationRoutes } from "./notification.routing";
import {NOTIFICATION_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(NotificationRoutes),
        GlobalModule
    ],
    declarations: [NOTIFICATION_VIEWS, NOTIFICATION_COMPONENT, NOTIFICATION_GRID_COLUMN_CELL_COMPONENTS],
    providers: [NotificationAPIResolver, NotificationService]
})
export class NotificationPermissionModule{}
