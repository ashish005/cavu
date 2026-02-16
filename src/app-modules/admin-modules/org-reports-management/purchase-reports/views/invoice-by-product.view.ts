import {Component, OnDestroy, OnInit} from "@angular/core";
import {ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {InvoiceByProductService} from "../services/invoice.service";
import {InvoiceByProduct, InvoiceByProductQueryOptions} from "../domains/invoice-by-product.serializer";

@Component({
  standalone: false,
    templateUrl: './templates/invoice.html'
})
export class InvoiceByProductView extends ViewExtender<InvoiceByProduct> implements OnInit, OnDestroy {
    override coreState: InvoiceByProductQueryOptions = new InvoiceByProductQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute, public override service: InvoiceByProductService){
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
