import {Component, OnDestroy, OnInit} from "@angular/core";
import {ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {
    InvoiceByExecutive,
    InvoiceByExecutiveQueryOptions
} from "../domains/invoice-by-executive.serializer";
import {InvoiceByExecutiveService} from "../services/invoice.service";

@Component({
  standalone: false,
  templateUrl: './templates/invoice.html'
})
export class InvoiceByExecutiveView extends ViewExtender<InvoiceByExecutive> implements OnInit, OnDestroy {
    override coreState: InvoiceByExecutiveQueryOptions = new InvoiceByExecutiveQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: InvoiceByExecutiveService){
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            { headerName: 'Name', field: 'name' },
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
