import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DateFormatCell, FullDateFormatCell, NumberCell, ViewExtender, CurrencyCell} from "@app-global";
import {ProductTransaction, ProductTransactionQueryOptions} from "../domains/transaction.serializer";
import {ProductTransactionService} from "../services/transaction.service";

@Component({
  standalone: false,
  templateUrl: './templates/transaction.html'
})
export class TransactionView extends ViewExtender<ProductTransaction> implements OnInit{
  override coreState: ProductTransactionQueryOptions = new ProductTransactionQueryOptions();
  constructor(public router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: ProductTransactionService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Product', field: 'productName', cellFn: rowData => `${rowData.productName}`},
            {headerName: 'Date', field: 'date', cellTemplate: FullDateFormatCell },//, cellFn: rowData => {return this.coreService.customDate(rowData.date)}
            {headerName: 'Type', cellFn: rowData => `${rowData.voucherType}` },
            {headerName: 'In', field: 'lastIn', cellTemplate: DateFormatCell },
            {headerName: 'Qty-In', field: 'quantityIn', cellTemplate: NumberCell },

            {headerName: 'Out', field: 'lastOut', cellTemplate: DateFormatCell },
            {headerName: 'Qty-Out', field: 'quantityOut', cellTemplate: NumberCell },

            {headerName: 'Amount', field: 'netAmount', class: 'text-right', cellTemplate: CurrencyCell },
            {headerName: 'Qty', field: 'netQuantity', class: 'text-right', cellTemplate: NumberCell }
        ];
    }

    get productId() {
    const { productId } = this.activatedRoute.parent.snapshot.params;
    return productId;
  }
    ngOnInit(){
        this.coreState.productId = this.productId;
        super.populateGrid();
    }
    actionCb(e){}
}
