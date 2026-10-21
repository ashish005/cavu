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
| Products & services | `products/items?item=<id>|new` | `inventory/views/items.view.ts` |
| Stock on hand, movements | `products/stock?filter=low|out`, `products/movements?item=<id>` | `inventory/views/stock.view.ts` |
| Opening stock, adjustments, transfers | `products/adjustments?doc=<id>|new=<kind>` | `inventory/views/stock-documents.view.ts` |
| Inventory reports, setup | `products/reports`, `products/setup` | `inventory/views/inventory-reports.view.ts`, `inventory-setup.view.ts` |

**Opening documents:** a document opens in a side panel (`FinanceDocumentDetailComponent`). New and edit use
`FinanceDocumentEditorComponent`. Deep links use `?doc=<id>` and `?new=1`. Old links `create/:voucherMasterType`
redirect to the new form.

**Grids:** grids follow the shared pattern (`ViewExtender` + `org-grid` + `org-grid-pagination`). Cells live in
`grid-cells/finance-cells.ts` and report button clicks through `FinanceGridEvents`.

**Amounts:** amounts use the `money` pipe (`Intl.NumberFormat`, so each currency gets its own decimals).

**Totals:** totals in the editor are a preview; the server computes the stored ones.

## Products & stock (`inventory/`)

The folder holds its own models, API service and grid cells, on `api/v1/inventory/*`. Its services are registered as
`INVENTORY_SERVICES` in `FinanceModule`. Backend rules are in `enricher-ai-extension/docs/inventory.md`.

- **Item picker on lines:** the document editor has an item picker on each item line (`InventoryApiService.itemOptions`).
  - **What it fills in:** description, unit, price, account and tax. The price is converted to the document's
    currency at its rate.
  - **Stocked items:** they show the stock on hand and a warehouse choice when the branch has several.
  - **Bills and debit notes:** the account is locked to the item's inventory account.
  - **Free-text lines** still work: unlink the item or leave it empty.
- **Item details on documents:** detail, print and email show the item code, HSN/SAC and unit. Posted invoices show
  the cost and margin per stocked line.
- **Grid cell clicks:** cells report `item`, `stock-doc` and `source` actions through `FinanceGridEvents`.
