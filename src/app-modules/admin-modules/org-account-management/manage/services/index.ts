import {AccountingAPIResolver} from "./api.resolver";
import { LedgerService, AccountGroupService } from "./ledger.service";

export {AccountingAPIResolver} from "./api.resolver";

export const ACCOUNTING_SERVICES = [
    AccountingAPIResolver,
    LedgerService, AccountGroupService
];