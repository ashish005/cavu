import {Component, OnInit} from '@angular/core';
import { GridUISwitchCellComponent, ViewExtender } from "@app-global";
import {ComplianceTypeService} from "../services";
import {ActivatedRoute} from "@angular/router";
import {ComplianceType, ComplianceTypeQueryOptions} from "../domains/compliance-type.domain";
import {SubscriptionCellComponent} from "../grid-cells/compliance-grid-cell.component";

@Component({
    templateUrl: './templates/compliance-type.html',
    providers: [ ComplianceTypeService ]
})
export class ComplianceTypeLayout extends ViewExtender<ComplianceType> implements OnInit{
    enabled: boolean = true;
    override coreState: ComplianceTypeQueryOptions = new ComplianceTypeQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: ComplianceTypeService){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name'},
            {headerName: 'Subscription', field: 'status', cellTemplate: SubscriptionCellComponent},
            {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ]
    }

    ngOnInit() { super.populateGrid(); }

    actionCb(row: ComplianceType) {}
}
