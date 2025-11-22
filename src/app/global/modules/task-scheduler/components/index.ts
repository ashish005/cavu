import {DailySchedulerInfoComponent} from "./daily-info.scheduler.component";
import {WeeklySchedulerInfoComponent} from "./weekly-info.scheduler.component";
import {MonthlySchedulerInfoComponent} from "./monthly-info.scheduler.component";
import {OnTaskSuccessSchedularComponent} from "./on-task-success.schedular.component";
import {SchedulerAdvanceSettingComponent} from "./advance-setting.component";
import {FrequencyTypeComponent} from "./frequency-type.component";
import {EventInfoSchedularComponent} from "./event-info.schedular.component";
export const SCHEDULER_COMPONENT = [
    FrequencyTypeComponent,
    DailySchedulerInfoComponent, WeeklySchedulerInfoComponent, MonthlySchedulerInfoComponent, EventInfoSchedularComponent,
    OnTaskSuccessSchedularComponent, SchedulerAdvanceSettingComponent
];
