# Subscription

Tenant-facing license and billing screens, lazy-loaded at `subscription` (`app/global/index.ts`, `portals/portal-module.ts`).

| Route             | View                  | What it does |
|-------------------|-----------------------|--------------|
| `info`            | `LicenseInfoView`     | Current license (status, term, days left, expiry/grace warnings), license settings, seat usage and included modules, plan comparison (users, then modules) |
| `manage`          | `ManageSubscriptionView` | Change plan, pause, resume or cancel (`?action=change|pause|resume|cancel&planId=`): review a server preview, then confirm |
| `payment`         | `PaymentView`         | Pick a plan (`?planId=` preselects; `?module=` explains a blocked module and preselects the first plan that has it), see the server-priced breakdown, enter billing and payment details, pay |
| `payment-return`  | `PaymentReturnView`   | Where the gateway sends the browser back (`?checkout=`); polls until the payment is confirmed, then reloads the app |
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
| `GET  v1/subscription/quote?planId=` → price and term of paying for a plan now (new, extend, or upgrade with credit) | `SubscriptionService.getQuote` (payment page order summary) |
| `POST v1/subscription/changes/preview` `{idempotencyKey, type, planId?, effectiveOn?, resumeOn?, reason?}` | `SubscriptionService.previewChange` |
| `POST v1/subscription/changes` (same body; applied now or scheduled) | `SubscriptionService.requestChange` |
| `DELETE v1/subscription/changes/{id}` (withdraw a scheduled change) | `SubscriptionService.cancelChange` |
| `POST v1/subscription/checkout` `{idempotencyKey, planId, billingName, billingEmail, billingContactNo?, billingAddress?, taxNumber?}` → `{id, status, checkoutUrl, …}` | `SubscriptionService.startCheckout` (then `window.location` to `checkoutUrl`) |
| `GET  v1/subscription/checkout/{id}` (server re-checks with the gateway) | `SubscriptionService.getCheckout` |
| `POST v1/subscription/payment` `{idempotencyKey, planId, paymentMode, paymentReferenceNumber, billingName, billingEmail, billingContactNo, billingAddress, taxNumber, remark}` | `SubscriptionService.purchase` |
| `GET  v1/subscription/entitlements` → `{entitlements: {access, planName, modules, …}, seatUsage}` | `EntitlementService` (`@app-global`, root-provided, cached until `load(true)`) |
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
- **Subscription status.** `Active` → `PastDue` (paid period over, still writable for the grace days) → `Expired`.
  `Paused` and `Canceled`/`Expired`/`Suspended` are read-only. The backend `SubscriptionLifecycleWorker` (every 15 min)
  applies scheduled changes and moves ended periods along; the license mirrors the subscription.
- **Billing period.** Plans are billed monthly on calendar terms (`billingInterval: 'Month'`, `intervalCount: 1`):
  a term starting 14 Oct ends 13 Nov. Renewing adds a month while keeping the original day of the month (a
  subscription started on the 31st renews on the 31st, or the month's last day). Show terms with `termLabel` /
  `billingLabel`, not `validityInDays`, which is only an approximation for month and year plans.
- **What a plan choice does** comes from the API as `PlanOffer.action`:
  `Purchase` (no running subscription: a new month from today), `Renew` (current plan: one more month after the current
  period end), `Upgrade` (worth at least as much per day: starts today, unused days of the current plan credited before
  tax), `Downgrade` (cheaper: scheduled for the day after the paid period ends, nothing to pay; blocked while more users
  are active than the new plan allows), `Unavailable` (with `unavailableReason`). The payment page only lists payable
  actions and always charges from a fresh server quote.
- **Changes.** One scheduled change at a time; a new request replaces it. Pause: from today or a later day within the
  paid period, for 1..`maxPauseDays` days, at most `maxPausesPerYear` times in 365 days; the resume is scheduled
  automatically and the paused days are added to the period end. Resume: now or any day up to the pause limit. Cancel:
  at the end of the paid period, can be withdrawn until then. Any purchase supersedes a scheduled change.
- **Currency** comes from the plan (`currencyCode`) and is stored on each invoice.
- **Not purchasable:** free/trial plans (`isPurchasable: false`), any purchase while paused (resume first), and while
  the license is `Pending`, `Suspended` by back office or `Revoked` (the UI shows a "contact support" message).
- **Self-service payment modes:** bank transfer, UPI, credit card, debit card. Cash and cheque are back-office only.

## Plan entitlements

Plan features are typed (`kind`): **Module** and **Flag** are included only when the plan lists them; **Seat** and
**Limit** are unlimited unless the plan sets a number. Module features use the application module codes that
permissions are built on (`FIN`, `EMP`, `TAX_MGT`, `STD`…); seat features carry the org user type code they cap
(`employee`, `customer`, `vendor`, or `*` for all members). The catalog lives in the backend's `SoftwareCatalog` /
`PlanFeatureCatalog`. A module the plans do not list at all is never gated.

- **Modules (UI).** Admin routes with `data.module` use `canMatch: [moduleGuard]`; a route the plan lacks redirects to
  `subscription/payment?module=<code>`. Hide smaller pieces of UI with `*appHasModule="'FIN'"`.
- **Modules (API).** Controllers or actions marked `[RequiresModule("FIN")]` return 403 `MODULE_NOT_IN_PLAN`.
- **Seats.** Adding, reactivating or changing the user type of a member fails with 422 `SEAT_LIMIT_REACHED` once the
  plan's limit for that type is reached (hard block, no overage). Members already over a lowered limit keep working.
- **No valid license** (missing, suspended, or expired past the grace days): the organisation is read-only. Every
  write outside `v1/subscription` returns 402 `LICENSE_INACTIVE`, and the portal routes to these screens.
- A worker (`LicenseExpiryWorker`) moves licenses past their end date plus grace days to `Expired` every 30 minutes.

## Paying

`overview.payment` says how the tenant pays: `gatewayName` (online, the default) and `manualEnabled` (typing the
reference of a payment made elsewhere; normally off in production, on in development). The pay button opens the
gateway's hosted page, so card and UPI details never reach this app. The return page needs the module to be reachable at
`admin/subscription` even before the license is valid, which `portals/portal-module.ts` provides. Gateway setup,
secrets and webhooks: backend `docs/payments.md`.

## Invoices

Invoices are rendered by `InvoiceDocumentComponent` from JSON with normal Angular bindings; no server HTML is injected.
Printing copies the rendered invoice into a hidden iframe, so the browser's "Save as PDF" produces a clean document.
The invoice popup is created from the root injector by the popup service, so `SoftwareInvoicePrintView` is standalone
and provides its own `SubscriptionService`.

## Known gaps / follow-ups

- **No automatic renewal charge.** Renewal is a new online payment; saved cards / UPI AutoPay mandates are not set up.
- **One currency per plan.** A tenant cannot switch between plans priced in different currencies (support case).
- **No automatic renewal charge** until a payment gateway is integrated: a `PastDue` tenant renews by paying manually.
- **Portal while read-only.** The portal routes a tenant without a valid license (paused, expired) to these screens
  only, although the API would still allow reads.
- **No seller details on invoices** (vendor name, address, tax id are not modelled on the backend).
