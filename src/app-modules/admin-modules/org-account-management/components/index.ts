import {AccountGroupCreateEditComponent} from "./account-group-ce.component";
import {AccountCreateEditComponent} from "./account-ce.component";
import {
    AccountGroupTreeComponent
} from "./account-group-tree.component";
import {BookSearchComponent} from "./book-search.component";
import {ReportSearchComponent} from "./report-search.component";
import {GroupSummaryComponent} from "./group-summary.component";

export const ACCOUNTING_COMPONENTS = [
    AccountGroupCreateEditComponent, AccountCreateEditComponent,
    AccountGroupTreeComponent, GroupSummaryComponent,
    BookSearchComponent, ReportSearchComponent//AccountingFilterComponent,
];
