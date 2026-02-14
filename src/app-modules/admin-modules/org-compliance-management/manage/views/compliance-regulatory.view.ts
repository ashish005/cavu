import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ComplianceAPIResolver, ComplianceRegulatoryService} from "../services";
import {ComplianceRegulatory, ComplianceRegulatoryQueryOptions} from "../domains/compliance-regulatory.serializer";
import {DateFormatCell, GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {
    RegulatoryCredentialCellComponent, RegulatoryRegCellComponent, RegulatoryRenewalCellComponent
} from "../grid-cells/regulatory-grid-cell.component";

@Component({
  standalone: false,
    templateUrl: './templates/compliance-regulatory.html',
    styles: [`:host {display: contents;}`]
})
export class ComplianceRegulatoryView extends ViewExtender<ComplianceRegulatory> implements OnInit{
    enabled: boolean = true;
    override coreState: ComplianceRegulatoryQueryOptions = new ComplianceRegulatoryQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: ComplianceRegulatoryService,
              public lookupResolver: ComplianceAPIResolver){
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Reg. No/Date', cellTemplate: RegulatoryRegCellComponent },
            {headerName: 'Credentials', cellTemplate: RegulatoryCredentialCellComponent },
            {headerName: 'Renewal Date', cellTemplate: RegulatoryRenewalCellComponent },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit() { super.populateGrid(); }

    actionCb(row: ComplianceRegulatory) {
        const inputData: any = {
            id: row.id,
            data: row
        };
        const popupHeader = {text: `${row.name}`, desc: ''};
        this.lookupResolver.showComplianceRegulatoryPopup(inputData, popupHeader, ()=> {
          super.populateGrid();
        });
    }

    newRegulatory(){
        const inputData: any = {
            id: null,
            data: new ComplianceRegulatory()
        };
        const popupHeader = {text: 'New Compliance Regulatory', desc: 'New Compliance'};
        this.lookupResolver.showComplianceRegulatoryPopup(inputData, popupHeader, ()=> {
            super.populateGrid();
        });
    }
}
