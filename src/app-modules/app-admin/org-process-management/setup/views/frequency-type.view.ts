import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

import {FrequencyType, FrequencyTypeQueryOptions} from "../domains/frequency-type.serializer";
import {FrequencyTypeService} from "../services/master-type.service";

@Component({
  standalone: false,
    templateUrl: './templates/common-grid.html',
    providers: [FrequencyTypeService]
})
export class FrequencyTypeView extends ViewExtender<FrequencyType> implements OnInit
{
  override coreState: FrequencyTypeQueryOptions = new FrequencyTypeQueryOptions();
  constructor(public override service: FrequencyTypeService,
              public override activatedRoute: ActivatedRoute){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Fee Type', field: 'isFeeType', cellTemplate: GridUISwitchCellComponent},
            {headerName: 'PeriodType', field: 'isPeriodType', cellTemplate: GridUISwitchCellComponent},
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    actionCb(row: any){}
}
