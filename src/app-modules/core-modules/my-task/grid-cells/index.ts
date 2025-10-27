import {
    ScheduledEndDateCell,
    ScheduledStartDateCell,
    ScheduledTaskLastRunCell,
    ScheduledTaskNameActionCell
} from "./scheduled-task-grid-cell.component";
import {CalendarEndDateCell, CalendarNameActionCell, CalendarStartDateCell} from "./org-calendar-grid-cell.component";
import {
    TaskLastRunLogCell,
    TaskNameActionCell,
    TaskScheduleInfoCell,
    TaskNextScheduleRunCell
} from "./my-task-grid-cell.component";
import {MyTaskLogNameActionCell, MyTaskLogRunCell} from "./my-task-log-grid-cell.component";

const MY_TASK_GRID_CELL = [
    TaskNameActionCell, TaskScheduleInfoCell,
    TaskLastRunLogCell, TaskNextScheduleRunCell
];

const SCHEDULED_TASK_GRID_COLUMN_CELL_COMPONENTS = [
    ScheduledTaskNameActionCell, ScheduledStartDateCell, ScheduledEndDateCell, ScheduledTaskLastRunCell
];

const CALENDAR_GRID_COLUMN_CELL_COMPONENTS = [
    CalendarNameActionCell, CalendarStartDateCell, CalendarEndDateCell
];

export const MY_TASK_GRID_COLUMN_CELL_COMPONENTS = [
    MY_TASK_GRID_CELL, SCHEDULED_TASK_GRID_COLUMN_CELL_COMPONENTS, CALENDAR_GRID_COLUMN_CELL_COMPONENTS,
    MyTaskLogNameActionCell, MyTaskLogRunCell
];
