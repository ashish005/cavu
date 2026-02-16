import {Component, OnDestroy, OnInit} from "@angular/core";
import {ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {InvoiceByPaymentService} from "../services/invoice.service";
import {InvoiceByPayment, InvoiceByPaymentQueryOptions} from "../domains/invoice-by-payment.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/invoice.html'
})
export class InvoiceByPaymentView extends ViewExtender<InvoiceByPayment> implements OnInit, OnDestroy {
    override coreState: InvoiceByPaymentQueryOptions = new InvoiceByPaymentQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: InvoiceByPaymentService){
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
