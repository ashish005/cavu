# Organization Setup Wizard

Four-step wizard shown by `portals/portal-module.ts` while `appSetup.hasValidOrgSetup()` is false.
It is mounted at the portal root, so the steps live at `/config`, `/branch`, `/seed`, `/finalize`.

| # | Route      | View                  | Required | What it does |
|---|------------|-----------------------|----------|--------------|
| 1 | `config`   | `OrgConfigView`       | yes      | Saves language, currency, timezone, date format, FY start, office hours |
| 2 | `branch`   | `BranchSetupView`     | yes      | Picks the existing branch to initialise (head branch by default) |
| 3 | `seed`     | `SeedApplicationView` | no       | Queues master / demo seed for that branch |
| 4 | `finalize` | `FinalizeSetupView`   | yes      | Shows a summary and reloads into `/app` |

## State and navigation

- `OrgWizardService` holds the state (`status` per step: `pending` / `completed` / `skipped`, the selected
  branch and seed result). It is saved per org in `sessionStorage`, so a refresh keeps progress,
  and it is cleared on finalize.
- The URL is the source of truth for the current step. `wizardStepGuard` sends deep links to a step whose
  earlier steps are not done to the furthest step the user can open.
- Each step's own action completes or skips it and moves to the next step. The footer **Next** button only
  moves forward over steps that are already done.
- Changing the branch in step 2 resets the seed step, because it was run against the old branch.

## Backend endpoints

`baseSectorAPIUrl` = `environment.tenantUrl + '/api'` (tenant service), `baseAPIUrl` = `environment.authBaseUrl + '/api'` (identity).

| Step | Call | Service |
|------|------|---------|
| resolver | `GET  {tenant}/v1/orgLookup/org-setup/{countryCode}` | `OrgSetupAPIResolver` |
| 1 | `PATCH {tenant}/v1/orgSetting/{unitConfigId}/setup` (also sets `IsConfigured = true`) | `OrgSettingService.updateUnitConfigSetup` |
| 3 | `POST {tenant}/v1/seed/tenant` `{orgId, orgBranchId, applyMasterSeed, applyDemoSeed}` | `queueTenantSeed` |
| 3, 4 | `GET  {tenant}/v1/seed/{orgBranchId}/status` → `{status, applyMasterSeed, applyDemoSeed, attemptCount, requestedAt, completedAt, nextAttemptAt, lastError}` | `getSeedStatus` |
| 4 | `PUT  {tenant}/v1/seed/success` `{orgBranchId}`, **only when seed was skipped** | `markSeedSuccess` |

Responses that return HTTP 200 with `isSuccess: false` are treated as errors.

### Why finalize does not always call `seed/success`

Seeding runs asynchronously. `POST seed/tenant` sets the branch to `Pending`, the worker
(`BranchSeedRequestWorker`) only picks up `Pending` branches, and it marks them `Completed` itself.
Calling `seed/success` straight after queueing would set the branch to `Completed` before the worker
runs, and the seed would never be applied. So the seed step reports "queued", not "applied", and
once a seed is queued the step can no longer be skipped.

### Live seed status

`SeedStatusComponent` (`<seed-status [branchId]>`) polls the status endpoint every 3 s until the branch is
`Completed` or `Failed` and shows the stages Requested → Queued → Seeding → Done (statuses
`Pending` → `Queued` → `Processing` → `Completed`).

- **Seed step:** shows the branch's current status. Queueing is disabled while a seed is in progress or
  already completed. If the branch was already seeded (for example during registration), the step completes
  automatically. A `Failed` seed shows the worker's error and a **Retry seeding** button, which re-queues it.
  A re-queue clears `SeedLastError`/`SeedNextAttemptAt`, so the worker picks it up straight away.
- **Finalize:** launch is disabled until the seed is `Completed` (or was skipped). An explicit
  "Launch without waiting" checkbox overrides this.

## Known gaps / follow-ups

- **Refresh after step 1 leaves the wizard.** Step 1 sets `IsConfigured = true`, and the portal gate only
  checks `hasValidOrgSetup()`. A full reload after step 1 therefore opens the app before seeding.
  Fixing this needs the portal gate to also check `GET v1/seed/{branchId}/status`.
- **No branch create/edit API** on the tenant service, so step 2 can only select a branch.
- The worker only picks up `Pending` branches, so a `Failed` seed is not retried automatically even though
  `SeedNextAttemptAt` is set. Retrying from the wizard works because re-queueing sets the branch back to `Pending`.
