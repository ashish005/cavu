import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {QuoteType, QuoteTypeQueryOptions} from "../domains/quotation-type.serializer";
import {QuoteTypeService} from "../services/voucher-type.service";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/common-grid.html'
})
export class QuoteTypeView extends ViewExtender<QuoteType> implements OnInit
{
  override coreState: QuoteTypeQueryOptions = new QuoteTypeQueryOptions();
  constructor(public override service: QuoteTypeService, public override activatedRoute: ActivatedRoute){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Order', field: 'sortOrder', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'isDefault', field: 'isDefault', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){ super.populateGrid(); }

    actionCb(row: any){}
}
