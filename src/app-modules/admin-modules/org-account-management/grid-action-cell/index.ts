import {LedgerNameCellComponent} from "./account-grid-cell.component";
import {VoucherCellComponent} from "./book-grid-cell.component";
import {
    TrialAccountGroupNameCell,
    TrialAccountNameCell
} from "./trial-balance-grid-cell.component";

export {LedgerNameCellComponent} from "./account-grid-cell.component";
export {VoucherCellComponent} from "./book-grid-cell.component";
export {TrialAccountGroupNameCell, TrialAccountNameCell} from "./trial-balance-grid-cell.component";

export const ACCOUNTING_GRID_CELL_COMPONENTS = [
    LedgerNameCellComponent, VoucherCellComponent,
    TrialAccountNameCell, TrialAccountGroupNameCell
];