import { TaskNameActionCell, TriggerCellComponent, ReminderCellComponent } from "./task-grid-cell.component";
import {
    TaskNextScheduleRunCell,
    TaskSummaryNameActionCell
} from "./task-summary-grid-cell.component";
import {ProcessWorkFlowCellComponent} from "./process-grid-cell.component";
import {
    ScheduledNameActionCell,
    ScheduledEndDateCell,
    ScheduledStartDateCell,
    ScheduledTaskLastRunCell
} from "./scheduled-grid-cell.component";

import {
    CalendarEndDateCell,
    CalendarNameActionCell,
    CalendarStartDateCell
} from "./task-calendar-grid-cell.component";
import {
    TaskReminderScheduleRunCell,
    ReminderNameActionCell,
    ReminderGroupActionCell, ReminderNotificationActionCell
} from "./task-reminder-grid-cell.component";

const REMINDER_GRID_COLUMN_CELLS = [
    ReminderNameActionCell, TaskReminderScheduleRunCell, ReminderGroupActionCell, ReminderNotificationActionCell
];

const CALENDAR_GRID_COLUMN_CELLS = [
    CalendarNameActionCell, CalendarStartDateCell, CalendarEndDateCell
];

const SCHEDULED_TASK_GRID_COLUMN_CELLS = [
    ScheduledNameActionCell, ScheduledStartDateCell, ScheduledEndDateCell, ScheduledTaskLastRunCell
];

export const PIPELINE_PROCESS_GRID_COLUMN_CELL_COMPONENTS = [
    ProcessWorkFlowCellComponent,
    TaskNameActionCell, ReminderCellComponent, TriggerCellComponent,
    TaskSummaryNameActionCell, TaskNextScheduleRunCell,
    SCHEDULED_TASK_GRID_COLUMN_CELLS, REMINDER_GRID_COLUMN_CELLS, CALENDAR_GRID_COLUMN_CELLS
];
