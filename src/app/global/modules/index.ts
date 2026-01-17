import {ThemeSettingComponent} from "./theme-setting/theme-setting.component";
import {SCHEDULER_COMPONENT} from "./task-scheduler/components";
import {SCHEDULER_VIEW_COMPONENT} from "./task-scheduler";

export {ShortScheduler} from "./task-scheduler";
export * from "./alert";
export const DEPENDENT_COMPONENTS = [
    ThemeSettingComponent, SCHEDULER_VIEW_COMPONENT, SCHEDULER_COMPONENT
];

export const DEPENDENT_MODULES = [];