import {Component, NgModule, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule, Routes} from "@angular/router";
import {AsidePanelComponent, GlobalModule} from "@app-global";
import {FINANCE_SERVICES} from "./services/finance-api.service";
import {FinanceStatusPipe, MoneyPipe} from "./grid-cells/finance-cells";
import {FinancePickerComponent} from "./views/finance-picker.component";
import {FinanceDocumentEditorComponent} from "./views/document-editor.component";
import {FinanceDocumentDetailComponent} from "./views/document-detail.component";
import {FinanceDocumentsView, ROUTE_OF_KIND} from "./views/documents.view";
import {FinanceDashboardView} from "./views/dashboard.view";
import {FinanceChartView} from "./views/chart.view";
import {FinanceReportsView} from "./views/reports.view";
import {
    FinanceAccountingView, FinanceDocumentTypesView, FinanceInvoicingView, FinancePostingView, FinanceRecurringView, FinanceTaxCodesView, FinanceTaxRulesView
} from "./views/settings.view";
import {FinanceKind} from "./domains/finance.models";
import {
    FinanceInventoryReportsView, FinanceInventorySetupView, FinanceItemsView, FinanceStockDocumentsView, FinanceStockMovementsView, FinanceStockView, INVENTORY_SERVICES
} from "./inventory";
import {BANKING_SERVICES, FinanceBankRulesView, FinanceBankStatementView, FinanceMoneyAccountsView, FinancePaymentModesView} from "./banking";
import {CAPTURE_SERVICES, FinanceCaptureInboxView, FinanceCaptureSettingsView} from "./capture";

interface NavItem { label: string; icon: string; route: string; }
interface NavSection { title: string; items: NavItem[]; }

/**
 * The finance workspace inside a portal: a section menu (dashboard, sales, purchases, accounting, settings), the page's
 * title and actions, and the page.
 */
@Component({
    selector: 'finance-shell',
    standalone: false,
    template: `
        <div class="d-flex flex" style="min-width: 0">
            <nav class="d-none d-md-flex flex-column b-r light lt" style="width: 200px; min-width: 200px">
                <div class="scroll-y py-2">
                    <ng-container *ngFor="let s of nav">
                        <div class="px-3 pt-2 pb-1 text-xs text-muted text-uppercase">{{ s.title }}</div>
                        <a *ngFor="let i of s.items" class="d-block px-3 py-1 text-sm fin-nav-link" [routerLink]="i.route" routerLinkActive="active _600"
                           [routerLinkActiveOptions]="{exact: false}"><i [class]="i.icon" class="fa-fw mr-1 text-muted"></i>{{ i.label }}</a>
                    </ng-container>
                </div>
            </nav>
            <div class="d-flex flex-column flex" style="min-width: 0">
                <div class="navbar flex-nowrap white lt box-shadow px-3">
                    <select class="form-control form-control-sm d-md-none mr-2" style="max-width: 160px" (change)="go($any($event.target).value)">
                        <ng-container *ngFor="let s of nav"><optgroup [label]="s.title"><option *ngFor="let i of s.items" [value]="i.route" [selected]="isActive(i.route)">{{ i.label }}</option></optgroup></ng-container>
                    </select>
                    <ng-container *ngTemplateOutlet="titleTemplate"></ng-container>
                    <span class="flex"></span>
                    <ng-container *ngTemplateOutlet="actionTemplate"></ng-container>
                </div>
                <div class="d-flex flex" style="min-height: 0">
                    <router-outlet (activate)="onActivate($event)"></router-outlet>
                </div>
            </div>
        </div>`,
    styles: [`:host { display: flex; flex: 1 1 auto; min-width: 0; } ::ng-deep ng-component { display: contents; }
        .fin-nav-link { color: inherit; border-left: 3px solid transparent; } .fin-nav-link.active { border-left-color: currentColor; background: rgba(120,130,140,.08); }
        .fin-nav-link:hover { background: rgba(120,130,140,.06); text-decoration: none; }`]
})
export class FinanceShell {
    titleTemplate: TemplateRef<any> | null = null;
    actionTemplate: TemplateRef<any> | null = null;
    readonly nav: NavSection[] = [
        {title: 'Overview', items: [{label: 'Dashboard', icon: 'fa fa-line-chart', route: 'dashboard'}]},
        {title: 'Sales', items: [
            {label: 'Invoices', icon: 'fa fa-file-text-o', route: ROUTE_OF_KIND.Invoice},
            {label: 'Credit notes', icon: 'fa fa-undo', route: ROUTE_OF_KIND.CreditNote},
            {label: 'Money in', icon: 'fa fa-arrow-down', route: ROUTE_OF_KIND.Receipt}]},
        {title: 'Purchases', items: [
            {label: 'Bills', icon: 'fa fa-file-o', route: ROUTE_OF_KIND.Bill},
            {label: 'Scan bills & receipts', icon: 'fa fa-camera', route: 'purchases/capture'},
            {label: 'Debit notes', icon: 'fa fa-repeat', route: ROUTE_OF_KIND.DebitNote},
            {label: 'Money out', icon: 'fa fa-arrow-up', route: ROUTE_OF_KIND.Payment}]},
        {title: 'Products & stock', items: [
            {label: 'Products & services', icon: 'fa fa-cubes', route: 'products/items'},
            {label: 'Stock on hand', icon: 'fa fa-archive', route: 'products/stock'},
            {label: 'Adjustments', icon: 'fa fa-sliders', route: 'products/adjustments'},
            {label: 'Stock movements', icon: 'fa fa-history', route: 'products/movements'},
            {label: 'Inventory reports', icon: 'fa fa-pie-chart', route: 'products/reports'},
            {label: 'Products setup', icon: 'fa fa-cog', route: 'products/setup'}]},
        {title: 'Accounting', items: [
            {label: 'Bank & cash', icon: 'fa fa-university', route: 'banking'},
            {label: 'Journals', icon: 'fa fa-book', route: ROUTE_OF_KIND.Journal},
            {label: 'Transfers', icon: 'fa fa-exchange', route: ROUTE_OF_KIND.Contra},
            {label: 'Chart of accounts', icon: 'fa fa-sitemap', route: 'accounting/chart'},
            {label: 'Reports', icon: 'fa fa-bar-chart', route: 'reports'},
            {label: 'Recurring', icon: 'fa fa-clock-o', route: 'recurring'}]},
        {title: 'Settings', items: [
            {label: 'Tax codes', icon: 'fa fa-percent', route: 'settings/tax-codes'},
            {label: 'Tax rules', icon: 'fa fa-random', route: 'settings/tax-rules'},
            {label: 'Invoicing', icon: 'fa fa-file-text', route: 'settings/invoicing'},
            {label: 'Payment modes', icon: 'fa fa-credit-card', route: 'settings/payment-modes'},
            {label: 'Bank rules', icon: 'fa fa-magic', route: 'settings/bank-rules'},
            {label: 'Document capture', icon: 'fa fa-camera', route: 'settings/capture'},
            {label: 'Document types', icon: 'fa fa-list-ol', route: 'settings/document-types'},
            {label: 'Accounting defaults', icon: 'fa fa-cogs', route: 'settings/accounting'},
            {label: 'Posting queue', icon: 'fa fa-tasks', route: 'settings/posting'}]}
    ];

    constructor(private router: Router, private route: ActivatedRoute) {}

    onActivate(view: any) {
        this.titleTemplate = view?.pageTitleTemplate ?? null;
        this.actionTemplate = view?.actionTemplate ?? null;
    }

    go(path: string) { this.router.navigate(path.split('/'), {relativeTo: this.route}); }
    isActive(path: string) { return this.router.url.split('?')[0].includes(`/${path}`); }
}

/** Earlier deep links (`create/:voucherMasterType`) open the new form of that kind. */
@Component({standalone: false, template: ''})
export class FinanceLegacyCreateRedirect {
    constructor(router: Router, route: ActivatedRoute) {
        const map: Record<string, FinanceKind> = {
            sale: 'Invoice', purchase: 'Bill', receipt: 'Receipt', payment: 'Payment', journal: 'Journal', contra: 'Contra', credit_note: 'CreditNote', debit_note: 'DebitNote'
        };
        const kind = map[(route.snapshot.paramMap.get('voucherMasterType') ?? '').toLowerCase()] ?? 'Invoice';
        router.navigate(['../..', ...ROUTE_OF_KIND[kind].split('/')], {relativeTo: route, queryParams: {new: 1}, replaceUrl: true});
    }
}

const kindRoute = (kind: FinanceKind, title: string) => ({path: ROUTE_OF_KIND[kind], component: FinanceDocumentsView, data: {kind, title, header: title}});

export const FINANCE_ROUTES: Routes = [
    {
        path: '', component: FinanceShell,
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
            {path: 'dashboard', component: FinanceDashboardView, data: {title: 'Finance', header: 'Finance'}},
            kindRoute('Invoice', 'Invoices'), kindRoute('CreditNote', 'Credit notes'), kindRoute('Receipt', 'Money in'),
            kindRoute('Bill', 'Bills'), kindRoute('DebitNote', 'Debit notes'), kindRoute('Payment', 'Money out'),
            kindRoute('Journal', 'Journals'), kindRoute('Contra', 'Transfers'),
            {path: 'products', pathMatch: 'full', redirectTo: 'products/items'},
            {path: 'products/items', component: FinanceItemsView, data: {title: 'Products & services', header: 'Products & services'}},
            {path: 'products/stock', component: FinanceStockView, data: {title: 'Stock on hand', header: 'Stock on hand'}},
            {path: 'products/adjustments', component: FinanceStockDocumentsView, data: {title: 'Stock adjustments', header: 'Stock adjustments'}},
            {path: 'products/movements', component: FinanceStockMovementsView, data: {title: 'Stock movements', header: 'Stock movements'}},
            {path: 'products/reports', component: FinanceInventoryReportsView, data: {title: 'Inventory reports', header: 'Inventory reports'}},
            {path: 'products/setup', component: FinanceInventorySetupView, data: {title: 'Products setup', header: 'Products setup'}},
            {path: 'purchases/capture', component: FinanceCaptureInboxView, data: {title: 'Scan bills & receipts', header: 'Scan bills & receipts'}},
            {path: 'banking', component: FinanceMoneyAccountsView, data: {title: 'Bank & cash', header: 'Bank & cash'}},
            {path: 'banking/:id', component: FinanceBankStatementView, data: {title: 'Bank statement', header: 'Bank statement'}},
            {path: 'accounting/chart', component: FinanceChartView, data: {title: 'Chart of accounts', header: 'Chart of accounts'}},
            {path: 'reports', component: FinanceReportsView, data: {title: 'Reports', header: 'Reports'}},
            {path: 'recurring', component: FinanceRecurringView, data: {title: 'Recurring', header: 'Recurring'}},
            {path: 'settings/tax-codes', component: FinanceTaxCodesView, data: {title: 'Tax codes', header: 'Tax codes'}},
            {path: 'settings/tax-rules', component: FinanceTaxRulesView, data: {title: 'Tax rules', header: 'Tax rules'}},
            {path: 'settings/invoicing', component: FinanceInvoicingView, data: {title: 'Invoicing', header: 'Invoicing'}},
            {path: 'settings/payment-modes', component: FinancePaymentModesView, data: {title: 'Payment modes', header: 'Payment modes'}},
            {path: 'settings/bank-rules', component: FinanceBankRulesView, data: {title: 'Bank rules', header: 'Bank rules'}},
            {path: 'settings/capture', component: FinanceCaptureSettingsView, data: {title: 'Document capture', header: 'Document capture'}},
            {path: 'settings/document-types', component: FinanceDocumentTypesView, data: {title: 'Document types', header: 'Document types'}},
            {path: 'settings/accounting', component: FinanceAccountingView, data: {title: 'Accounting defaults', header: 'Accounting defaults'}},
            {path: 'settings/posting', component: FinancePostingView, data: {title: 'Posting queue', header: 'Posting queue'}},
            {path: 'create/:voucherMasterType', component: FinanceLegacyCreateRedirect},
            {path: '**', redirectTo: 'dashboard'}
        ]
    }
];

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule.forChild(FINANCE_ROUTES), GlobalModule, AsidePanelComponent, MoneyPipe, FinanceStatusPipe, FinancePickerComponent],
    providers: [FINANCE_SERVICES, INVENTORY_SERVICES, BANKING_SERVICES, CAPTURE_SERVICES],
    declarations: [
        FinanceShell, FinanceLegacyCreateRedirect, FinanceDashboardView, FinanceDocumentsView, FinanceDocumentEditorComponent, FinanceDocumentDetailComponent,
        FinanceChartView, FinanceReportsView, FinanceTaxCodesView, FinanceTaxRulesView, FinanceInvoicingView, FinanceDocumentTypesView, FinanceAccountingView, FinancePostingView,
        FinanceRecurringView, FinanceItemsView, FinanceStockView, FinanceStockMovementsView, FinanceStockDocumentsView, FinanceInventoryReportsView,
        FinanceInventorySetupView, FinanceMoneyAccountsView, FinanceBankStatementView, FinancePaymentModesView, FinanceBankRulesView, FinanceCaptureInboxView,
        FinanceCaptureSettingsView
    ]
})
export class FinanceModule {}
