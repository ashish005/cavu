import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ProfitLossReportQueryOptions, ProfitLossWrapper} from "../../domains/reports/profit-loss-report.serializer";
import {ProfitLossReportService} from "../../services/report.service";

@Component({
  standalone: false,
  templateUrl: './templates/profit-loss.html'
})
export class ProfitLossReportView implements OnDestroy {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  coreState: ProfitLossReportQueryOptions;
    expense: ProfitLossWrapper = new ProfitLossWrapper();
    income: ProfitLossWrapper = new ProfitLossWrapper();

  isLoading: boolean;
  paramsSubscription : Subscription;
  constructor(private service: ProfitLossReportService, public activatedRoute: ActivatedRoute) {
    this.coreState = new ProfitLossReportQueryOptions();
  }

  ngOnInit(){}

    searchActionCb(row){
        this.coreState.startDate = row.startDate;
        this.coreState.endDate = row.endDate;
        this.populateGrid();
    }

    populateGrid<T>() {
        this.updateGrid<T>(this.coreState);
    }

    updateGrid<T>(_coreState) {
      this.isLoading = true;
        this.paramsSubscription = this.service.list(_coreState).subscribe((resp: any) => {
            this.isLoading = false;
            const data = resp.entities;
            this.expense.highlist = data.filter(r => r.isExpense && r.isHighPriority);
            this.expense.lowlist = data.filter(r => r.isExpense && !r.isHighPriority);
            this.income.highlist = data.filter(r => r.isIncome && r.isHighPriority);
            this.income.lowlist = data.filter(r => r.isIncome && !r.isHighPriority);
        });
    }

  ngOnDestroy(){ this.paramsSubscription?.unsubscribe();}

  actionCb(e){}
}
