import {Component, OnDestroy, OnInit} from "@angular/core";
import {ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {InvoiceByVendor, InvoiceByVendorQueryOptions} from "../domains/invoice-by-vendor.serializer";
import {InvoiceByVendorService} from "../services/invoice.service";

@Component({
  standalone: false,
    templateUrl: './templates/invoice.html'
})
export class InvoiceByVendorView extends ViewExtender<InvoiceByVendor> implements OnInit, OnDestroy {
    override coreState: InvoiceByVendorQueryOptions = new InvoiceByVendorQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: InvoiceByVendorService){
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
        ];
    }
    override ngOnDestroy(){ super.ngOnDestroy(); }
    ngOnInit() { }

    searchActionCb(row)
    {
        this.coreState.startDate = row.startDate;
        this.coreState.endDate = row.endDate;
        super.populateGrid();
    }
  actionCb(e: any){}
}
