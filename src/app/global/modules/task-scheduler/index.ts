import {SchedulerInfoComponent} from "./schedular-info.component";
import {MultiSchedulerInfoComponent} from "./multi-scheduler-info.component";
import {TestFrequencyCalenderView} from "./test-frequency-calender.view";
import {TestSchedulerCalenderView} from "./test-scheduler-calender.view";
import {OrgSchedularComponent} from "./org-schedular.component";
import {FrequencyTypeComponent} from "./components/frequency-type.component";
export {SchedularDomain} from "./domains/schedular.domain";
export const SCHEDULER_VIEW_COMPONENT = [ OrgSchedularComponent, FrequencyTypeComponent, SchedulerInfoComponent, MultiSchedulerInfoComponent, TestFrequencyCalenderView, TestSchedulerCalenderView];
