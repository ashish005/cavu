import {DailySchedulerInfoComponent} from "./daily-info.scheduler.component";
import {WeeklySchedulerInfoComponent} from "./weekly-info.scheduler.component";
import {MonthlySchedulerInfoComponent} from "./monthly-info.scheduler.component";
import {EventSchedulerInfoComponent} from "./event-info.schedular.component";
import {SchedulerAdvanceSettingComponent} from "./advance-setting.component";
import {FrequencyTypeComponent} from "./frequency-type.component";

export const SCHEDULER_COMPONENT = [
    FrequencyTypeComponent,
    DailySchedulerInfoComponent, WeeklySchedulerInfoComponent, MonthlySchedulerInfoComponent, EventSchedulerInfoComponent, SchedulerAdvanceSettingComponent
];
