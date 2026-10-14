# Process management

Lazy-loaded at `admin/process` (module `PROCESS_MGT`, `app/global/index.ts`). Backend: `api/v1/process/*` on the tenant
API (`baseSectorAPIUrl`); behaviour and operations are documented in the backend's `docs/process-automation.md`.

| Route | View | What it does |
|---|---|---|
| `tasks` | `TasksView` | My tasks / my team queues / all, grouped Overdue · Today · Next 7 days · Later; quick Start, Done, Take |
| `processes` | `ProcessesView` | Processes with stage progress; start one from a workflow |
| `processes/:id` | `ProcessDetailView` | Stage stepper, approve / move / hold / resume / cancel, tasks by stage, history |
| `calendar` | `CalendarView` | Month grid of tasks by due day |
| `workflows`, `workflows/:id`, `workflows/new` | `WorkflowsView`, `WorkflowEditorView` | Stages (order, colour, time limit, auto vs approval) and the tasks each stage creates |
| `schedules`, `schedules/:id`, `schedules/new` | `SchedulesView`, `ScheduleEditorView` | Create a task or start a process on a repeat pattern; live preview of the next runs; run history |

`TaskPanelComponent` is the shared modal for viewing, creating and editing a task.

## Conventions

- **Times.** The API sends UTC instants. Show them with `{{ iso | zoned : lookups.orgTimeZone }}` and enter them with
  `zonedLocalToIso` / `isoToZonedLocal` (`domains/zoned-time.ts`), so users always work in the organisation's timezone
  whatever their browser's. Schedule dates/times are local to the schedule's own timezone and are sent as-is.
- **Who can do what** comes from the API: `lookups.isAdmin` (workflows, schedules), `ProcessDetail.canApprove`
  and `canManage`, `TaskDetail.canEdit` and `canWork`. The UI only hides actions; the API enforces them.
- **Errors** are read with `errorMessageOf` (ProblemDetails `detail` for business rules, validation `errors`).
- Lookups (users, roles, workflows, timezone) are fetched once per visit by `ProcessApiService.lookups()`.
