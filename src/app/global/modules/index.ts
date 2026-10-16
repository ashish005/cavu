import {SCHEDULER_COMPONENT} from "./task-scheduler/components";
import {SCHEDULER_VIEW_COMPONENT} from "./task-scheduler";

export {ShortScheduler} from "./task-scheduler";
export * from "./alert";
export {AppearancePanelComponent, AppearanceEditorComponent, AppearanceApiService} from "./theme-setting/appearance.component";
export type {Appearance, AppearanceStyle, AppearanceFont} from "./theme-setting/services/theme-manager.service";
export {APPEARANCE_STYLES, APPEARANCE_FONTS, DEFAULT_APPEARANCE, ThemeManagerService} from "./theme-setting/services/theme-manager.service";
export const DEPENDENT_COMPONENTS = [
    SCHEDULER_VIEW_COMPONENT, SCHEDULER_COMPONENT
];

export const DEPENDENT_MODULES = [];