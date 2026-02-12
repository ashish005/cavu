import {Component, OnInit} from "@angular/core";
import {BalanceSheetReportService, ProfitLossReportService} from "../../services/report.service";
import {CashBookService, BankLedgerService} from "../../services/account-book.service";
import {ProfitLossReport, ProfitLossReportQueryOptions} from "../../domains/reports/profit-loss-report.serializer";
import {BalanceSheetReport, BalanceSheetReportQueryOptions} from "../../domains/reports/balance-sheet-report.serializer";
import {CashBookQueryOptions} from "../../domains/book/cash-book.serializer";
import {BankLedgerQueryOptions} from "../../domains/book/bank-ledger.serializer";
import { forkJoin } from "rxjs";

@Component({
  standalone: false,
  templateUrl: './templates/dashboard.html'
})
export class AccountingDashboardView implements OnInit {
  netProfit: number = 0;
  totalAssets: number = 0;
  totalLiabilities: number = 0;
  cashBalance: number = 0;
  bankBalance: number = 0;
  loading: boolean = true;

  constructor(
    private plService: ProfitLossReportService,
    private bsService: BalanceSheetReportService,
    private cashService: CashBookService,
    private bankService: BankLedgerService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const fromDate = firstDayOfYear.toISOString().split('T')[0];
    const toDate = now.toISOString().split('T')[0];

    const plOptions = new ProfitLossReportQueryOptions();
    plOptions.startDate = fromDate;
    plOptions.endDate = toDate;

    const bsOptions = new BalanceSheetReportQueryOptions();
    bsOptions.startDate = fromDate;
    bsOptions.endDate = toDate;

    const cashOptions = new CashBookQueryOptions();
    cashOptions.startDate = fromDate;
    cashOptions.endDate = toDate;

    const bankOptions = new BankLedgerQueryOptions();
    bankOptions.startDate = fromDate;
    bankOptions.endDate = toDate;

    forkJoin({
      pl: this.plService.list(plOptions),
      bs: this.bsService.list(bsOptions),
      cash: this.cashService.list(cashOptions),
      bank: this.bankService.list(bankOptions)
    }).subscribe({
      next: (resp: any) => {
        // Calculate Net Profit
        if (resp.pl && resp.pl.entities) {
          const entities = resp.pl.entities as ProfitLossReport[];
          const income = entities.filter((r: ProfitLossReport) => r.isIncome).reduce((a: number, b: ProfitLossReport) => a + (b.amount || 0), 0);
          const expense = entities.filter((r: ProfitLossReport) => r.isExpense).reduce((a: number, b: ProfitLossReport) => a + (b.amount || 0), 0);
          this.netProfit = income - expense;
        }

        // Calculate Assets and Liabilities
        if (resp.bs && resp.bs.entities) {
          const entities = resp.bs.entities as BalanceSheetReport[];
          this.totalAssets = entities.filter((r: BalanceSheetReport) => r.isAsset).reduce((a: number, b: BalanceSheetReport) => a + (b.amount || 0), 0);
          this.totalLiabilities = entities.filter((r: BalanceSheetReport) => r.isLiability).reduce((a: number, b: BalanceSheetReport) => a + (b.amount || 0), 0);
        }

        // Cash and Bank balances
        if (resp.cash && resp.cash.entities && resp.cash.entities.length > 0) {
            this.cashBalance = resp.cash.entities.reduce((a: number, b: any) => a + (+b.balance || 0), 0);
        }
        if (resp.bank && resp.bank.entities && resp.bank.entities.length > 0) {
            this.bankBalance = resp.bank.entities.reduce((a: number, b: any) => a + (+b.balance || 0), 0);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.loading = false;
      }
    });
  }
}
