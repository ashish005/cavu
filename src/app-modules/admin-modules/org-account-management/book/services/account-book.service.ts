import {Injectable, Injector} from "@angular/core";
import { OrgResourceService } from "@app-global";

import {DayBook, DayBookSerializer} from "../domains/day-book.serializer";
import {CashBook, CashBookSerializer} from "../domains/cash-book.serializer";
import {BankLedger, BankLedgerSerializer} from "../domains/bank-ledger.serializer";
import {LedgerBook, LedgerBookSerializer} from "../domains/ledger-book.serializer";
import {
    LedgerGroupSummary,
    LedgerGroupSummarySerializer
} from "../domains/trial-balance/ledger-group-summary.serializer";
import {TrialBalance, TrialBalanceSerializer} from "../domains/trial-balance/trial-balance.serializer";
import {
    LedgerReportMonthly,
    LedgerReportMonthlySerializer
} from "../domains/trial-balance/ledger-report-monthly.serializer";
import {
    TrialBalanceLedger,
    TrialBalanceLedgerSerializer
} from "../domains/trial-balance/trial-balance-ledger.serializer";

@Injectable()
export class DayBookService extends OrgResourceService<DayBook>{
  constructor(public override injector: Injector) { super(injector, 'dayBook', new DayBookSerializer()); }
}

@Injectable()
export class CashBookService extends OrgResourceService<CashBook>{
    constructor(public override injector: Injector) { super(injector, 'cashBook', new CashBookSerializer()); }
}

@Injectable()
export class LedgerBookService extends OrgResourceService<LedgerBook>{
    constructor(public override injector: Injector) { super(injector, 'ledgerBook', new LedgerBookSerializer()); }
}

@Injectable()
export class BankLedgerService extends OrgResourceService<BankLedger>{
    constructor(public override injector: Injector) { super(injector, 'bankLedgerBook', new BankLedgerSerializer()); }
}

@Injectable()
export class TrialBalanceByGroupService extends OrgResourceService<TrialBalance>{
    constructor(public override injector: Injector) { super(injector, 'accountBook/trial-blnc', new TrialBalanceSerializer()); }
}

@Injectable()
export class TrialBalanceByLedgerService extends OrgResourceService<TrialBalanceLedger>{
    constructor(public override injector: Injector) { super(injector, 'accountBook/trial-blnc-by-ledger', new TrialBalanceLedgerSerializer()); }
}

@Injectable()
export class LedgerGroupSummaryService extends OrgResourceService<LedgerGroupSummary> {
    constructor(public override injector: Injector) { super(injector, 'accountBook/ledger-group', new LedgerGroupSummarySerializer()); }
}

@Injectable()
export class LedgerReportMonthlyService extends OrgResourceService<LedgerReportMonthly>{
    constructor(public override injector: Injector) { super(injector, 'accountBook/ledger/monthly-summary', new LedgerReportMonthlySerializer()); }
}
