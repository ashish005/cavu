import {Component, Directive, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {PurchaseOrderService, SaleOrderService} from "../services/inventory-transaction.service";
import {ProductTransactionQueryOptions, PurchaseOrder, SaleOrder} from "../domains/inventory-transaction.serializer";
import {DateFormatCell, NumberCell, ViewExtender} from "@app-global";

@Component({
  standalone: false,
  templateUrl: './templates/default-view.html'
})
export class PurchaseOrderView extends ViewExtender<PurchaseOrder> implements OnInit{
  override coreState:  ProductTransactionQueryOptions = new ProductTransactionQueryOptions();
  constructor(private router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: PurchaseOrderService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'party', field: 'partyName'},
            {headerName: 'voucherNo', field: 'voucherNo'},
            {headerName: 'voucherDate', field: 'voucherDate', cellTemplate: DateFormatCell},//, cellFn: rowData => {return this.coreService.customDate(rowData.invoiceDate)}
            {headerName: 'type', field: 'voucherType'},
            //{headerName: 'Order No', field: 'orderNo' },
            //{headerName: 'Order Date', field: 'orderDate', cellTemplate: FullDateFormatCell },
            {headerName: 'voucherTotal', field: 'netAmount', class: 'text-right', cellTemplate: NumberCell}
            //{headerName: 'Discount', field: 'discountAmount', class: 'text-right', cellTemplate: NumberCell }
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

  createNew(){}
  actionCb(e){}
}

@Component({
  standalone: false,
  templateUrl: './templates/default-view.html'
})
export class SaleOrderView extends ViewExtender<SaleOrder> implements OnInit{
  override coreState: ProductTransactionQueryOptions = new ProductTransactionQueryOptions();
    constructor(private router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: SaleOrderService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'party', field: 'partyName'},
            {headerName: 'voucherNo', field: 'voucherNo'},
            {headerName: 'voucherDate', field: 'voucherDate', cellTemplate: DateFormatCell},//, cellFn: rowData => {return this.coreService.customDate(rowData.invoiceDate)}
            {headerName: 'type', field: 'voucherType'},
            //{headerName: 'Order No', field: 'orderNo' },
            //{headerName: 'Order Date', field: 'orderDate', cellTemplate: FullDateFormatCell },
            {headerName: 'voucherTotal', field: 'netAmount', class: 'text-right', cellTemplate: NumberCell}
            //{headerName: 'Discount', field: 'discountAmount', class: 'text-right', cellTemplate: NumberCell }
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
  createNew(){}
  actionCb(e){}
}

