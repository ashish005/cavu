import {SchedulerInfoComponent} from "./schedular-info.component";
import {MultiSchedulerInfoComponent} from "./multi-scheduler-info.component";
import {TestSchedulerCalenderView} from "./test-scheduler-calender.view";
import {TaskActivityComponent} from "./task-activity.component";
import {SCHEDULER_IMPORT_COMPONENT} from "./components";
import {ComplianceFrequencyComponent} from "./compliance-scheduler.component";
export {SchedularDomain} from "./domains/schedular.domain";
export const SCHEDULER_VIEW_COMPONENT = [
    ...SCHEDULER_IMPORT_COMPONENT, ComplianceFrequencyComponent,
    TaskActivityComponent,
    SchedulerInfoComponent, MultiSchedulerInfoComponent, TestSchedulerCalenderView
];
