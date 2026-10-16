# Organisation administration (`org-admin`)

Lazy module under `/app/admin/setup` (the `app-identity` layout). Talks to the tenant API `api/v1/org-admin/*`; backend
design and deployment notes are in the backend repo at `docs/org-admin.md`.

| Route | View | What |
|---|---|---|
| `org/profile` | `OrgProfileView` | Name, legal name, tax registration, address, contacts |
| `org/settings` | `OrgSettingsView` | Language, base currency, time zone, date format, week start, financial year, office hours |
| `org/branding` | `OrgBrandingView` | Logo, browser icon, login image, colours |
| `org/features` | `OrgFeaturesView` | Plan modules and feature switches |
| `org/branches` | `OrgBranchesView` | Branches, head branch, setup state and retry |
| `org/hosts` | `OrgHostsView` | Host names the organisation is reached on |
| `access/member-types` | `OrgMemberTypesView` | Member type names, number formats, relations |
| `access/requirements` | `OrgRequirementsView` | Contacts, addresses and documents each member type must provide |
| `access/dashboards` | `OrgDashboardsView` | Dashboard portlets: on/off, order, size, which roles see each |
| `access/roles` | `OrgRolesView` + `OrgRoleEditorComponent` | Roles grid; editor with a module × action permission matrix |
| `access/members` | `OrgMembersView` | Members grid; change a member's roles |
| `integrations/messaging` | `OrgIntegrationsView` (`data.page`) | Email, SMS, WhatsApp, Slack and Teams connections |
| `integrations/payments` | same | Stripe and Razorpay |
| `integrations/webhooks` | same | Outbound webhooks and their events |
| `integrations/activity` | `OrgIntegrationActivityView` | Tests, deliveries and received events; send failed deliveries again |

## Patterns

- **Grids:** grids follow the app-wide pattern: `ViewExtender<T>` + an `OrgResourceService` grid service +
  `<org-grid>` / `<org-grid-pagination>`. Filters live on a `CoreQueryOptions` subclass (`RoleQueryOptions`, …), and
  `applyFilter()` resets to page 1.
- **Cell buttons:** `org-grid` has no output for cells, so the buttons in `grid-cells/org-admin-cells.ts` report through
  `OrgAdminGridEvents`; the view subscribes to it.
- **Forms and panels:** forms use `OrgAdminApiService` (unwraps `{isSuccess, data}`), and errors are shown with
  `errorMessageOf`. A missing permission shows the API's "You need the … permission" message. Editors are right-hand
  `<app-aside>` panels.
- **Connection forms:** these are built from the integration catalog (`GET integrations/catalog`). Secrets are write-only,
  and a blank secret keeps the stored one.
- **Branding images:** these are loaded from `OrgAdminApiService.assetUrl(id)`, which needs no sign-in.

Everything in this area uses the tenant API; the identity server is used only for sign-in. The older screens
(`org-setup`, `module-permission`, `access-setup`, and `app-admin/integration`) were removed. Their routes redirect to
the replacements (`legacyRedirects` in `app-identity/index.ts`).

The app shell uses the same API for:
- the member's module access (`AppPermissionService` → `me/access`);
- the member's appearance (`AppearancePanelComponent` → `v1/appearance/me`; defaults under `org/appearance`);
- branch setup (`AppSetupService.onFinalizeSetup` → `v1/seed`).

Portal dashboards are the global `<org-dashboard>` (`app/global/components/org-dashboard`). It loads
`v1/dashboard/me` and renders each portlet's `v1/dashboard/portlets/{code}/data` generically, as figures, a list and bars.
