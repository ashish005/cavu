import {Component, OnDestroy, OnInit} from "@angular/core";
import {ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {InvoiceByDayService} from "../services/invoice.service";
import {InvoiceByDay, InvoiceByDayQueryOptions} from "../domains/invoice-by-day.serializer";

@Component({
  standalone: false,
    templateUrl: './templates/invoice.html'
})
export class InvoiceByDayView extends ViewExtender<InvoiceByDay> implements OnInit, OnDestroy {
    override coreState: InvoiceByDayQueryOptions = new InvoiceByDayQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: InvoiceByDayService){
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
        ];
    }
    override ngOnDestroy(){ super.ngOnDestroy(); }
    ngOnInit() { }

    searchActionCb(row){
        this.coreState.startDate = row.startDate;
        this.coreState.endDate = row.endDate;
        super.populateGrid();
    }
  actionCb(e: any){}
}
