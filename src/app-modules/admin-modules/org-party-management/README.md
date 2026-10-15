# Customers, vendors & employees

Lazy-loaded at `app/admin/parties` (header → Finance & Regulation). Backend: `api/v1/parties/*` on the tenant API;
behaviour, accounting and security in the backend's `docs/parties.md`.

| Route | View | What it does |
|---|---|---|
| `customers`, `vendors`, `employees` | `PartyListView` (route data `role`, gated by FIN / VEN / EMP) | search, status, department filter, sort by balance; balance column per role (receivable, payable, advances); credit hold, 1099, missing W-9 badges |
| `<role>/:id` | `PartyDetailView` | balance, available credit, this year, net position across roles; aging; statement with date range and CSV; details; status, portal access |
| `aging` | `AgingView` | receivables / payables / employee advances by days past due, as of a date; CSV |
| `1099` | `Form1099View` | US 1099 summary for a year; CSV |
| `settings` | `PartySettingsView` | payment terms, departments, designations |

`PartyEditorComponent` creates and edits any role in the right-hand `app-aside` (global `AsidePanelComponent`): shared
details plus only the role's section; country-aware states, ZIP and bank routing labels; write-only tax ids and bank
numbers (masked, revealable by administrators); live duplicate warning with "Add as …" to give an existing party the
new role.

## In the sector portals

The portal menus' Employee / Client / Supplier entries (`org-emp`, `client`, `supplier` in `core-modules/index.ts`) load
`PartyPortalModule`: the same list and detail screens (from `PartyViewsModule`) inside the portal, with a small header
bar for their title and actions (`PartyPortalShell`, since portal layouts have no page header). Route data sets `role`,
`module` (EMP / FIN / VEN, checked by `moduleGuard`) and `embedded: true` (hides admin-only links such as Aging).
Titles use the organisation's own name for each role from its user types (`lookups.roleLabels`: Patient, Student,
Client, Rider, Supplier…).

The legacy `core-modules/org-employee`, `org-client` and `org-supplier` screens (BAS endpoints) are no longer routed.
