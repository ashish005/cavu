# Finance workspace (org-voucher)

Invoicing and accounting on the tenant API `api/v1/finance/*`. Backend docs: `enricher-ai-extension/docs/finance.md`.
Mounted by the portal routes `invoice` and `org-invoice` (core-modules/index.ts), module code `FIN`.

| Area | Route | View |
|---|---|---|
| Dashboard | `dashboard` | `FinanceDashboardView` |
| Invoices, credit notes, money in | `sales/invoices`, `sales/credit-notes`, `sales/receipts` | `FinanceDocumentsView` (route data `kind`) |
| Bills, debit notes, money out | `purchases/bills`, `purchases/debit-notes`, `purchases/payments` | `FinanceDocumentsView` |
| Journals, transfers | `accounting/journals`, `accounting/transfers` | `FinanceDocumentsView` |
| Chart of accounts | `accounting/chart` | `FinanceChartView` |
| Reports | `reports?tab=pl|bs|tb|ledger|journals` | `FinanceReportsView` |
| Recurring | `recurring` | `FinanceRecurringView` |
| Settings | `settings/tax-codes|invoicing|document-types|accounting|posting` | `settings.view.ts` |

**Opening documents:** a document opens in a side panel (`FinanceDocumentDetailComponent`). New and edit use
`FinanceDocumentEditorComponent`. Deep links use `?doc=<id>` and `?new=1`. Old links `create/:voucherMasterType`
redirect to the new form.

**Grids:** grids follow the shared pattern (`ViewExtender` + `org-grid` + `org-grid-pagination`). Cells live in
`grid-cells/finance-cells.ts` and report button clicks through `FinanceGridEvents`.

**Amounts:** amounts use the `money` pipe (`Intl.NumberFormat`, so each currency gets its own decimals).

**Totals:** totals in the editor are a preview; the server computes the stored ones.
