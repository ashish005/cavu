import {Component, Directive, OnDestroy, OnInit} from '@angular/core';
import {ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {ComplianceReportService} from "../services/report.service";
import {ComplianceReport, ComplianceReportQueryOptions} from "../domains/compliance-report.serializer";

@Component({
  standalone: false,
    templateUrl: './templates/compliance.html',
    providers: [ComplianceReportService],
    styles: [`::ng-deep ng-component{ display: contents;} :host { display: contents;}`]
})
export class ComplianceReportView extends ViewExtender<ComplianceReport> implements OnInit, OnDestroy {
  override coreState: ComplianceReportQueryOptions = new ComplianceReportQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: ComplianceReportService){
    super(activatedRoute, service);

    this.service.refreshReportGrid.subscribe(r => {
        super.populateGrid();
    });
  }
  override ngOnDestroy(){ super.ngOnDestroy(); }

  ngOnInit() { super.populateGrid(); }

    searchActionCb(row){
        this.coreState.startDate = row.startDate;
        this.coreState.endDate = row.endDate;
        super.populateGrid();
    }
}
