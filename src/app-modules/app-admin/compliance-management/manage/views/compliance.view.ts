import { Component, OnInit } from '@angular/core';
import { ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import { ComplianceService, ComplianceAPIResolver } from "../services";
import {Compliance, ComplianceQueryOptions} from "../domains/compliance.serializer";
import {
    ComplianceNameCellComponent, ComplianceRateCellComponent,
    ComplianceSchedulerCellComponent
} from "../grid-cells/compliance-grid-cell.component";

@Component({
  standalone: false,
  templateUrl: './templates/compliance.html',
  styles: [`:host {display: contents;}`]
})
export class ComplianceView extends ViewExtender<Compliance> implements OnInit{
    enabled: boolean = true;
    override coreState: ComplianceQueryOptions = new ComplianceQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
                public override service: ComplianceService,
                public lookupResolver: ComplianceAPIResolver){
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name', cellTemplate: ComplianceNameCellComponent },
            {headerName: 'Regulatory', field: 'regulatoryName' },
            {headerName: 'Executive Name', field: 'empExecutiveName' },
            //{headerName: 'Rate', field: 'name', cellTemplate: ComplianceRateCellComponent },
            {headerName: 'Subscription', field: 'subscriptionName' },
            //{headerName: 'Regulatory Authority', field: 'regulatoryName', cellTemplate: ComplianceRegulatoryNameCellComponent },
            //{headerName: 'Renewal Date', field: 'regulatoryRenewalDate', cellTemplate: DateFormatCell },
            {headerName: 'Due Date', field: 'taskName', cellTemplate: ComplianceSchedulerCellComponent }
        ]
    }

    ngOnInit() { super.populateGrid(); }

    actionCb(row: Compliance) {
        const inputData: any = {
            id: row.id,
            data: row
        };
        const popupHeader = {text: `${row.name}`, desc: ''};
        this.lookupResolver.showCompliancPopup(inputData, popupHeader, ()=> {
          super.populateGrid();
        });
    }

    newCompliance(){
        const inputData: any = {
            id: null,
            data: new Compliance()
        };
        const popupHeader = {text: 'New Compliance', desc: 'New Compliance'};
        this.lookupResolver.showCompliancPopup(inputData, popupHeader, ()=> {
          super.populateGrid();
        });
    }
}
