import {RouterModule, Routes} from "@angular/router";
import {ExpenseManageView} from "./views/manage.view";
import {ExpenseLayout} from "./layout/layout";
import {ExpenseAPIResolver} from "./services/api.resolver";
import {ExpenseLedgerView} from "./views/expense-ledger.view";
import {ExpenseDashboardView} from "./views/expense-dashboard.view";
import {ExpenseAccountGroupView} from "./views/expense-account-group.view";
import {InvoiceTemplateView} from "./views/invoice-template.view";

const translatePath = 'modules.invoice.ofc_expense.sub_module';
export const Expense_Routes: Routes = [
  {
    path: '', component: ExpenseLayout, resolve: { items: ExpenseAPIResolver },
      data: { code: "OFC_EXPENSE", vMasterType: 'EXPENSE', translatePath: 'modules.invoice.ofc_expense' },
      children:[
      { path: '', pathMatch: 'full', redirectTo:'manage' },
      { path: 'dashboard', component: ExpenseDashboardView, data: { vMasterType: 'EXPENSE', code:'', icon: 'fa fa-shield', title: `${translatePath}.dashboard.title`, header: `${translatePath}.dashboard.header` } },
      //{ path: 'manage', loadChildren: () => import('app-modules/manage-invoice').then(m => m.InvoiceManageModule), data: { hideSidebar: true, vMasterType: INVOICE_UI_VIEW.EXPENSE, code:'', icon: 'fa fa-shield', title: `${translatePath}.manage.title`, header: `${translatePath}.manage.header`} },
      { path: 'manage', component: ExpenseManageView, data: { title: 'Office Expense', header:'Office Expense', vMasterType: 'expense' } },
      { path: 'group', component: ExpenseAccountGroupView, data: { vMasterType: 'EXPENSE', code:'', icon: 'fa fa-shield', title: `${translatePath}.acc_group.title`, header: `${translatePath}.acc_group.header` } },
      { path: 'templates', component: InvoiceTemplateView, data: { vMasterType: 'invoice', code:'', icon: 'fa fa-shield', title: `${translatePath}.template.title`, header: `${translatePath}.template.header` } },
      { path: 'ledger/:id', component: ExpenseLedgerView, data: { vMasterType: 'EXPENSE', code:'', icon: 'fa fa-shield', title: `${translatePath}.ledger.title`, header: `${translatePath}.ledger.header` } },
    ]
  }
];
export const EXPENSE_VIEWS = [
    ExpenseLayout,
    ExpenseDashboardView, ExpenseManageView, ExpenseLedgerView, ExpenseAccountGroupView, InvoiceTemplateView
];

export const ExpenseRoute = RouterModule.forChild(Expense_Routes);
