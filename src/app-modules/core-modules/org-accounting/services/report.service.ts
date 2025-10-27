import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {BalanceSheetReport, BalanceSheetReportSerializer} from "../domains/reports/balance-sheet-report.serializer";
import {ProfitLossReport, ProfitLossReportSerializer} from "../domains/reports/profit-loss-report.serializer";

@Injectable()
export class BalanceSheetReportService extends OrgResourceService<BalanceSheetReport>{
    constructor(public override injector: Injector) { super(injector, 'financialReport/balanceSheet', new BalanceSheetReportSerializer()); }
}

@Injectable()
export class ProfitLossReportService extends OrgResourceService<ProfitLossReport>{
    constructor(public override injector: Injector) { super(injector, 'financialReport/profitLoss', new ProfitLossReportSerializer()); }
}
