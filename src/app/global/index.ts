export {CoreProcessFactory} from "./pluginFactory";

export {GlobalModule} from "./library.module";

export * from "./animations";
export * from "./components";
export * from "./enums";
export * from "./extender-classes";
export * from './helpers';
export * from './lookups';
export * from "./services";
export * from "./pipes";
export * from "./popup-module/app-popup.enum";

export * from "./modules";

export { AppTitleService } from "./app-title.service";
export { SharedService } from "./shared.service";

export const EMPLOYEE_COMMON_ROUES = [
    {
        isFLatChildren: false, key: 'Account & Finance',
        children:[
            { routeTo: ['accounting/dashboard'], icon:"fa fa-dashboard", code: "FIN", key: 'Accounting Dashboard' },
            { routeTo: ['accounting/ledger'], icon:"fa fa-group", code: "", key: 'Account' },
            { routeTo: ['accounting/book'], icon:"fa fa-bell", code: "", key: 'Account Book' },//code: "COM"
            { routeTo: ['accounting/report'], icon:"fa fa-bell", code: "", key: 'Financial Report' },//code: "COM"
            { routeTo: ['accounting/trxn'], icon:"fa fa-bell", code: "", key: 'Financial Trxn' },//code: "COM"
            { routeTo: ['office-expense'], icon:"fa fa-dashboard", key: "Office Expenses" },
            { routeTo: ['manage-invoice'], icon:"fa fa-dashboard", key: "Invoices" }
        ]
    },
    {
        isFLatChildren: false, key: 'Reports',
        children:[
            { routeTo: ['reports/sale'], icon:"fa fa-group", code: "", key: 'Sale Report' },
            { routeTo: ['reports/purchase'], icon:"fa fa-bell", code: "", key: 'Purchase Report' },//code: "COM"
            { routeTo: ['reports/payment'], icon:"fa fa-bell", code: "", key: 'Payment Report' },//code: "COM"
            { routeTo: ['reports/receipt'], icon:"fa fa-bell", code: "", key: 'Receipt Report' },//code: "COM"
            { routeTo: ['reports/inventory'], icon:"fa fa-dashboard", key: "Inventory Report" },
            { routeTo: ['manage-invoice'], icon:"fa fa-dashboard", key: "Invoices" }
        ]
    },
    {
        isFLatChildren: false, key: 'Others',
        children:[
            { routeTo: ['compliance-report'], icon:"fa fa-group", code: "", key: 'Audit & Compliance' }
        ]
    },
    {
        isFLatChildren: false, key: 'Contact',
        children:[
            { routeTo: ['org-emp'], icon:"fa fa-group", code: "EMP", key: 'mainLayout.user.employee' },
            { routeTo: ['vendor'], icon:"fa fa-bell", code: "PERM_VENDOR", key: 'mainLayout.user.supplier' },//code: "COM"
            { routeTo: ['client'], icon:"fa fa-bell", code: "PERM_CLIENT", key: 'mainLayout.user.client' },//code: "COM"
        ]
    },
    /*{
          isFLatChildren: false, key: 'mainLayout.heading.pay_roll',
          children:[
              { routeTo: ['salary'], icon:"fa fa-credit-card", code: "SAL", name: "Salary", key: 'layout.salary' },
              { routeTo: ['salary/payroll'], icon:"fa fa-users", code:'SAL_PAYROLL', name: "Pay Roll", key: 'layout.payroll' }
          ]
      },*/
];
