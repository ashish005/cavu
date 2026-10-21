# Compliance (org-compliance-management)

The module is lazy-loaded at `admin/compliance`, under module `CMP` (`app/global/index.ts`, `moduleGuard`). It talks
to the backend at `api/v1/compliance/*` on the tenant API (`baseSectorAPIUrl`). Backend rules are in
`enricher-ai-extension/docs/compliance.md`.

The old `/app/compliance-report` portal links redirect to `admin/compliance/report`. This module replaced the BAS-era
grid and popup module.

| Route | View | What it does |
|---|---|---|
| `dashboard` | `ComplianceDashboardView` | Overdue, due in 7 days, in review, on-time rate, areas, six-month trend, licences to renew. Prompts to review the profile and suggestions |
| `tasks` | `ComplianceTasksView` | Work queue (open, overdue, due soon, in review, done, not needed, all), mine, area, search. List or board of open work. `?task=` `?obligation=` `?status=` |
| `calendar` | `ComplianceCalendarView` | Month of due dates |
| `registrations` | `ComplianceRegistrationsView` | Licences, registrations, permits and certificates: expiry, documents, encrypted portal login, renewal tracking |
| `report` | `ComplianceReportView` | Per obligation for a period: due, on time, late, not needed, open, overdue, paid. CSV and print |
| `obligations` | `ComplianceObligationsView` | Active, suggested, paused and retired obligations. Bulk activate or dismiss suggestions. `?obligation=<id>\|new` |
| `setup` | `ComplianceSetupView` | Profile (legal form, conditions, jurisdictions, default owner, escalation) and the catalog filtered to what applies, with reasons |

## Pieces

- **`components/task-panel.component`:** one task. It shows the guidance and penalty, people (editable), the filing
  details (filed on, reference, amount), the actions the API allows, evidence upload and download, and the history.
  The dashboard, tasks and calendar use it inside `<app-aside>`.
- **`components/obligation-editor.component`:** an obligation's fields and schedule. It previews the next due dates as
  the schedule changes and offers lifecycle actions (activate, pause, resume, retire or dismiss, catalog update,
  delete).
- **`services/compliance-api.service`:** every call. It also provides `errorMessageOf`, `upload` (multipart) and
  `download` (blob, with the auth headers).
- **`domains/compliance.models`:** contracts, labels, badges, and `dueText`.

## Conventions

- **House style:** follows `org-process-management`. That means NgModule views, template-driven forms,
  `takeUntilDestroyed`, errors shown inline through `errorMessageOf`, and lookups fetched once per visit
  (`ComplianceApiService.lookups()`).
- **Permissions:** what a user may do comes from the API: `lookups.canWork`, `canManage`, `canDelete`, and each task's
  `actions` and `canEdit`. The UI only hides controls; the API enforces.
- **Dates:** ISO `yyyy-MM-dd`. "Today" is the branch's date from `lookups.today`.
