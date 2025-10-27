import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ComplianceAPIResolver, ComplianceRegulatoryService} from "../services";
import {ComplianceRegulatory, ComplianceRegulatoryQueryOptions} from "../domains/compliance-regulatory.serializer";
import {DateFormatCell, GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {
    ComplianceRegulatoryRenewalCellComponent,
    ComplianceRegulatoryUrlCellComponent
} from "../grid-cells/compliance-grid-cell.component";

@Component({
  standalone: false,
    templateUrl: './templates/compliance-regulatory.html'
})
export class ComplianceRegulatoryView extends ViewExtender<ComplianceRegulatory> implements OnInit{
    enabled: boolean = true;
    pageTitle: string;
    override coreState: ComplianceRegulatoryQueryOptions = new ComplianceRegulatoryQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: ComplianceRegulatoryService,
              public lookupResolver: ComplianceAPIResolver){
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Registration No', field: 'registrationNo' },
            {headerName: 'Registration Date', field: 'registrationDate', cellTemplate: DateFormatCell },

            {headerName: 'Credentials (UserId/ Password)', cellTemplate: ComplianceRegulatoryUrlCellComponent },
            {headerName: 'Renewal Date', field: 'registrationDate', cellTemplate: ComplianceRegulatoryRenewalCellComponent },
            {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
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
}
