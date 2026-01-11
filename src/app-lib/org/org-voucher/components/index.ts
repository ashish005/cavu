
import {AddRoundOffComponent} from "./add-round-off/add-round-off.component";
//import { ProjectModuleDropdownComponent } from "./project-module-dropdown/project-module-dropdown.component";


import {FinanceAccountSearchComponent, FinanceDayCashBookSearchComponent} from "./search-filters/search.component";
import {ItemGridFormComponent} from "./item-grid-form/item-grid-form.component";
import {AccountGridFormComponent} from "./account-grid-form/account-grid-form.component";
import {AccountItemFormComponent} from "./account-grid-form/account-item-form.component";
import {ItemRowFormComponent} from "./item-grid-form/item-row-form.component";
import {GridPaymentReceiptComponent} from "./payment/payment-form.component";
import {PrimaryLoadedTypeAheadComponent} from "./payment/primary-loaded-type-ahead.component";
import {ProductSearchPanelComponent} from "./product-search-panel/product-search-panel.component";
import {AccountTypeAheadComponent} from "./voucher-type-ahead/voucher-type-ahead.component";
import {InvoiceHtmlPrintView} from "./print/invoice-html-print.view";
import {InvoicePdfPrintView} from "./print/invoice-pdf-print.view";

export const FINANCE_COMPONENT = [
    ItemGridFormComponent, ItemRowFormComponent,
    AccountGridFormComponent, AccountItemFormComponent,
    ProductSearchPanelComponent,
    GridPaymentReceiptComponent, AccountTypeAheadComponent, PrimaryLoadedTypeAheadComponent,
    AddRoundOffComponent,
    //ProjectModuleDropdownComponent,
    InvoiceHtmlPrintView, InvoicePdfPrintView
];
export const FINANCE_ENTRY_COMPONENT = [
    FinanceAccountSearchComponent, FinanceDayCashBookSearchComponent
];