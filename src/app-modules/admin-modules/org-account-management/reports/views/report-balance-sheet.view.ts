import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {BalanceSheetReportQueryOptions, BalanceSheetWrapper} from "../domains/balance-sheet-report.serializer";
import {BalanceSheetReportService} from "../services/report.service";

@Component({
  standalone: false,
  templateUrl: './templates/balance-sheet.html'
})
export class BalanceSheetReportView {
    //@ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    coreState: BalanceSheetReportQueryOptions = new BalanceSheetReportQueryOptions();
    liability: BalanceSheetWrapper = new BalanceSheetWrapper();
    asset: BalanceSheetWrapper = new BalanceSheetWrapper();

    isLoading: boolean;
    public pageTitle: string;
    paramsSubscription : Subscription;
    constructor(private service: BalanceSheetReportService,
              public activatedRoute: ActivatedRoute) {
    }

    ngOnInit(){}

    searchActionCb(row){
        this.coreState.startDate = row.startDate;
        this.coreState.endDate = row.endDate;
        this.populateGrid();
    }
    ngOnDestroy(){ this.paramsSubscription?.unsubscribe();}

    populateGrid<T>() {
        this.updateGrid<T>(this.coreState);
    }

    updateGrid<T>(_coreState) {
        this.isLoading = true;
        this.paramsSubscription = this.service.list(_coreState).subscribe((resp: any) => {
            this.isLoading = false;
            const data = resp.entities;
            this.liability.highlist = data.filter(r => r.isLiability && r.isHighPriority);
            this.liability.lowlist = data.filter(r => r.isLiability && !r.isHighPriority);
            this.asset.highlist = data.filter(r => r.isAsset && r.isHighPriority);
            this.asset.lowlist = data.filter(r => r.isAsset && !r.isHighPriority);
        });
    }

    actionCb(e){}
}
