import {AmountInBookCell, BankAccountActionCell, BankAccountNoCell} from "./bank-grid.cell";
import {TrxnTypeAllocationCeComponent} from "./trxn-type-allocation-ce.component";
import {TrxnTypeAccountsComponent, TrxnTypeAllocationListComponent} from "./trxn-type-accounts.component";

export const BANKING_ENTRY_COMPONENT = [
    BankAccountNoCell, BankAccountNoCell, BankAccountNoCell, BankAccountActionCell,
    AmountInBookCell, AmountInBookCell
];
export const BANKING_COMPONENT = [
    TrxnTypeAllocationCeComponent,
    TrxnTypeAccountsComponent, TrxnTypeAllocationListComponent
];