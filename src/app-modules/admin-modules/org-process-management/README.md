# Process management

Lazy-loaded at `admin/process` (module `PROCESS_MGT`, `app/global/index.ts`). Backend: `api/v1/process/*` on the tenant
API (`baseSectorAPIUrl`); behaviour and operations are documented in the backend's `docs/process-automation.md`.

| Route | View | What it does |
|---|---|---|
| `dashboard` | `DashboardView` | KPIs with change vs the previous period, daily throughput, bottleneck stages, SLA hotspots, team and people workload, workflows table, automation health; filters (7/30/90 days, workflow, team) scope everything; every chart has a table view |
| `tasks` | `TasksView` | My tasks / my team queues / all, grouped Overdue · Today · Next 7 days · Later; quick Start, Done, Take |
| `processes` | `ProcessesView` | Processes with stage progress; start one from a workflow |
| `processes/:id` | `ProcessDetailView` | Stage stepper, approve / move / hold / resume / cancel, tasks by stage, history |
| `calendar` | `CalendarView` | Month grid of tasks by due day |
| `workflows`, `workflows/:id`, `workflows/new` | `WorkflowsView`, `WorkflowEditorView` | Stages (order, colour, time limit, auto vs approval) and the tasks each stage creates |
| `schedules`, `schedules/:id`, `schedules/new` | `SchedulesView`, `ScheduleEditorView` | Create a task or start a process on a repeat pattern; live preview of the next runs; retry policy; run history. `new?entityType=&entityId=&entityName=` links it to a record |
| `triggers` | `TriggersView` | Rules: "when a record … happens, start workflow X" or "send a notification" (`NotifyEditorComponent`: channels, subject/message with field placeholders, dynamic recipients with per-recipient conditions, attachments). For workflow rules: record type + event, condition builder, process name template, owner, one-per-record; dry run against sample data |
| `teams` | `TeamsView` | Teams (after BAS user groups): chosen / rule-based / mixed membership with exclusions, routing (shared queue, round-robin, least busy), lead, external contacts; live member preview in a virtual-scroll list |
| `events` | `EventsView` | Event log: what each record event did (started, switched, ignored, failed), payload, run again |

The workflow editor also edits each stage's **automatic switches** ("when the record's `approved` event arrives → next
stage"; "after 48 hours → Escalation"). Rules point at stages by position; moving or removing stages keeps them right.

`TaskPanelComponent` is the shared modal for viewing, creating and editing a task. `ConditionBuilderComponent` edits
conditions for triggers and stage rules (`cleanCondition` before saving).

## Using it from other modules

Link work to your records instead of storing process or schedule ids:

- `CoreProcessFactory.showEntityWorkflow({type: 'compliance', id, name}, header)` opens `EntityWorkflowPanelComponent`
  (`app/global/modules/entity-workflow`): the record's processes, open tasks and schedules; start a workflow, add a
  task, set up a repeat. It can also be used inline: `<entity-workflow-panel [entity]="…">`.
- `EntityWorkflowService.publishEvent(entity, 'approved', payload, key)` tells workflows something happened, so
  triggers can start processes and stage rules can move running ones.
- Use one lowercase type code per kind of record (`purchase_order`), the same in triggers and stage rules.

## Conventions

- **Times.** The API sends UTC instants. Show them with `{{ iso | zoned : lookups.orgTimeZone }}` and enter them with
  `zonedLocalToIso` / `isoToZonedLocal` (`domains/zoned-time.ts`), so users always work in the organisation's timezone
  whatever their browser's. Schedule dates/times are local to the schedule's own timezone and are sent as-is.
- **Who can do what** comes from the API: `lookups.isAdmin` (workflows, schedules), `ProcessDetail.canApprove`
  and `canManage`, `TaskDetail.canEdit` and `canWork`. The UI only hides actions; the API enforces them.
- **Errors** are read with `errorMessageOf` (ProblemDetails `detail` for business rules, validation `errors`).
- Lookups (users, roles, workflows, timezone) are fetched once per visit by `ProcessApiService.lookups()`.

## Popups

Every editor in this module opens in `AsidePanelComponent` (`<process-aside>`): the app's right-aligned, full-height
`modal-right` panel with a scrolling body and a fixed footer (`<div aside-footer>`). Put long lists in a
`cdk-virtual-scroll-viewport` inside it (see the team member preview). It closes on Escape or a backdrop click.

## Charts

`components/dashboard-charts.ts` holds three dependency-free pieces (`dash-line-chart`, `dash-bar-list`,
`dash-stat`) built to the team's data-viz rules: 2px lines with one crosshair tooltip for all series, thin bars with a
4px rounded end and 2px gaps between stacked segments, values only at line ends and bar tips, hairline grid, legends
for two or more series. Colours are role tokens in `views/templates/dashboard.css` (validated light and dark steps:
series blue/orange, sequential blue, status good/warning/critical always with an icon and label); chart text uses ink
tokens only. Dark mode follows the OS setting or `data-theme="dark"`.
