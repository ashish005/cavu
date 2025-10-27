import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {TrackerAPIResolver} from "./services/api.resolver";
import {TrackerManageView} from "./views/tracker-manage.view";
import {RouterModule} from "@angular/router";
import {TRACKER_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {BookingRcptManageView} from "./views/booking-rcpt-manage.view";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', pathMatch: 'full', redirectTo:'rcpt' },
            { path: 'rcpt', data: { translatePath: 'modules.rcpt.manage' }, component: BookingRcptManageView },
            { path: 'tracker', data: { translatePath: 'modules.project.manage' }, component: TrackerManageView },
        ]),
        GlobalModule
    ],
    providers: [
        TrackerAPIResolver
    ],
    declarations: [TrackerManageView, BookingRcptManageView, TRACKER_GRID_COLUMN_CELL_COMPONENTS]
})
export class TrackerModule {}
