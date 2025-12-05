import {ThemeSettingComponent} from "./theme-setting/theme-setting.component";
import {PROCESS_COMPONENT} from "./org-process";
import {SCHEDULER_COMPONENT} from "./task-scheduler/components";
import {SCHEDULER_VIEW_COMPONENT} from "./task-scheduler";

export {ShortScheduler} from "./task-scheduler";
export * from "./alert";
export const DEPENDENT_COMPONENTS = [
    ThemeSettingComponent, PROCESS_COMPONENT, SCHEDULER_VIEW_COMPONENT, SCHEDULER_COMPONENT
];