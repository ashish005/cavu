import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SaleChannelService} from "../services/voucher-type.service";
import {SaleChannel, SaleChannelQueryOptions} from "../domains/sale-channel.serializer";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({ standalone: false, templateUrl: './templates/common-grid.html' })
export class SaleChannelView extends ViewExtender<SaleChannel> implements OnInit
{
  override coreState: SaleChannelQueryOptions = new SaleChannelQueryOptions();
  constructor(public override service: SaleChannelService, public override activatedRoute: ActivatedRoute){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Commission Rate', field: 'commissionRate' },
            {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){ super.populateGrid(); }

    actionCb(row: any){}
}
