import {SchedulerInfoComponent} from "./schedular-info.component";
import {MultiSchedulerInfoComponent} from "./multi-scheduler-info.component";
import {TestSchedulerCalenderView} from "./test-scheduler-calender.view";
import {FrequencyTypeComponent} from "./components/frequency-type.component";
import {TaskActivityComponent} from "./task-activity.component";
export {SchedularDomain} from "./domains/schedular.domain";
export const SCHEDULER_VIEW_COMPONENT = [
    FrequencyTypeComponent,
    TaskActivityComponent,
    SchedulerInfoComponent, MultiSchedulerInfoComponent, TestSchedulerCalenderView
];
