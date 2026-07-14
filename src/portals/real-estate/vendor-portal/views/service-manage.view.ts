import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Product, ProductQueryOptions} from "../domains/product.serializer";
import {ProductService} from "../services/product.service";
import {ViewExtender, GridUISwitchCellComponent, SharedService} from "@app-global";
import {
    ProductBarcodeCell,
    ProductBrandCell,
    ProductPriceCell,
    ProductTypeNameCell
} from "../grid-cells/product-grid-cell.component";

@Component({
    styles: [`:host { display: contents;}`],
    templateUrl: './templates/default-view.html',
    standalone: false
})
export class ServicesManageView extends ViewExtender<Product> implements OnInit {
  override coreState: ProductQueryOptions = new ProductQueryOptions();
    header: any = { text: 'Executive', options:[] };
    constructor(private router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: ProductService,
                protected sharedService: SharedService) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Product', field: 'name' },
            {headerName: 'Barcode', cellTemplate: ProductBarcodeCell},
            {headerName: 'Brand', cellTemplate: ProductBrandCell},
            {headerName: 'Type', field: 'productType', cellTemplate: ProductTypeNameCell },
            {headerName: 'Selling Price', cellTemplate: ProductPriceCell},
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ]
    }

    ngOnInit(){
        // const { id } = <LoginUser>this.coreService.currentUser;
        // (<any>this.coreState).orgUserId = id;//this.apiResolver.vendor.id;
        super.populateGrid();
    }

    actionCb(row: Product){}

    createNew(){}
}
