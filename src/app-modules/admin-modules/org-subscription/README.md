# Subscription

Tenant-facing license and billing screens, lazy-loaded at `subscription` (`app/global/index.ts`, `portals/portal-module.ts`).

| Route             | View                  | What it does |
|-------------------|-----------------------|--------------|
| `info`            | `LicenseInfoView`     | Current license (status, term, days left, expiry/grace warnings), license settings, plan comparison matrix |
| `payment`         | `PaymentView`         | Pick a plan (`?planId=` preselects), see the server-priced breakdown, enter billing and payment details, pay |
| `payment-success` | `PaymentSuccessView`  | Outcome of the purchase (passed as router state); falls back to a generic message on reload |
| `license-history` | `LicenseHistoryView`  | Paged license events (issued, renewed, plan changed, ...) |
| `invoices`        | `SoftwareInvoiceView` | Paged invoices; **View** opens the invoice in an aside with Print / Save as PDF |

## Backend endpoints

All calls go to the tenant service: `baseSectorAPIUrl` = `environment.tenantUrl + '/api'`. The tenant is resolved on the
server from the `X-Tenant-Id` / `X-Branch-Id` headers (added by `auth.interceptor.ts`); no org, tenant or software id
is ever sent from this module.

| Call | Used by |
|------|---------|
| `GET  v1/subscription` → `{software, license, plans, features, billingContact}` | `SubscriptionService.getOverview` (cached per module until refresh or purchase) |
| `POST v1/subscription/payment` `{idempotencyKey, planId, paymentMode, paymentReferenceNumber, billingName, billingEmail, billingContactNo, billingAddress, taxNumber, remark}` | `SubscriptionService.purchase` |
| `GET  v1/subscription/history?skip&take` (paged, max 100) | `LicenseHistoryService` |
| `GET  v1/subscription/invoices?skip&take` (paged, max 100) | `SoftwareInvoiceService` |
| `GET  v1/subscription/invoices/{id}` | `SubscriptionService.getInvoice` |

Errors come back in three shapes, all read by `errorMessageOf`: `{isSuccess: false, message}`, ProblemDetails
(`detail` is user-facing for 422 business-rule failures), and validation problems (`errors`).

## Rules the UI relies on (enforced by the API)

- **Prices are server-side.** Plans arrive with `rate`, `discountAmount`, `taxableAmount`, `taxAmount`, `netAmount`;
  the purchase request carries only the plan id. Discount applies to the rate, tax to the discounted amount.
- **Idempotent purchase.** The view generates an `idempotencyKey` per purchase attempt and reuses it when the same
  request is resubmitted (e.g. after a timeout), so the API returns the first result (`isReplay: true`) instead of
  billing twice. Changing any field produces a new key. Purchases for one tenant are serialised with a DB advisory lock.
- **Term.** Renewing the *current* plan before it lapses adds the plan's days to the current end date. Any other plan,
  or a lapsed license, starts a new term today. Unused days are not prorated.
- **Not purchasable:** free/trial plans (`isPurchasable: false`), and any purchase while the license is `Pending`,
  `Suspended` or `Revoked` (the UI shows a "contact support" message).
- **Self-service payment modes:** bank transfer, UPI, credit card, debit card. Cash and cheque are back-office only.

## Invoices

Invoices are rendered by `InvoiceDocumentComponent` from JSON with normal Angular bindings; no server HTML is injected.
Printing copies the rendered invoice into a hidden iframe, so the browser's "Save as PDF" produces a clean document.
The invoice popup is created from the root injector by the popup service, so `SoftwareInvoicePrintView` is standalone
and provides its own `SubscriptionService`.

## Known gaps / follow-ups

- **No payment gateway.** The user enters the reference of a payment made outside the app, and the license is issued
  immediately. There is no verification step. Before taking real card payments, integrate a gateway (hosted checkout, so
  card data never touches this app) and issue the license from its confirmed webhook, or add a "pending verification"
  state for manual modes.
- **Currency.** Plans have no currency on the backend; the UI bills in `SUBSCRIPTION_BILLING_CURRENCY` (`USD`).
- **No proration** when switching plans mid-term (see *Term*).
- **No seller details on invoices** (vendor name, address, tax id are not modelled on the backend).
