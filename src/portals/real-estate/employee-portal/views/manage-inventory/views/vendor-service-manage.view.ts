import { GridUISwitchCellComponent, ViewExtender, ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Product, ProductQueryOptions} from "../domains/product.serializer";
import {
    ProductBarcodeCell, ProductBrandCell,
    ProductNameActionCell,
    ProductPriceCell,
    ProductTypeNameCell
} from "../grid-cells/product-grid-cell.component";
import {ProductService} from "../services/product.service";
import {ProductFormComponent} from "../components/product-form.view";

@Component({
  standalone: false,
    styles: [`:host { display: contents;}`],
    templateUrl: './templates/default-view.html'
})
export class VendorServicesManageView extends ViewExtender<Product> implements OnInit {
    override coreState: ProductQueryOptions = new ProductQueryOptions();
    header: any = { text: 'Executive', options:[] };
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: ProductService,
                protected sharedService: SharedService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Product', field: 'name', cellTemplate: ProductNameActionCell },
            {headerName: 'Barcode', cellTemplate: ProductBarcodeCell},
            {headerName: 'Brand', cellTemplate: ProductBrandCell},
            {headerName: 'Type', field: 'productType', cellTemplate: ProductTypeNameCell },
            {headerName: 'Selling Price', cellTemplate: ProductPriceCell},
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ]
    }
    id: string;
    vendorId: string;
    accountId: string;

    ngOnInit(){
        const { data, parent } = this.activatedRoute.snapshot;
        //const { productId, vendorId} = parent.params;
        const { id, accountId, vendorId } = parent.data?.item?.data;
        this.id = id;
        this.vendorId = vendorId;
        this.accountId = accountId;
        (<any>this.coreState).vendorId = vendorId;//this.apiResolver.vendor.id;
        (<any>this.coreState).accountId = accountId;//this.apiResolver.vendor.id;
        super.populateGrid();
    }

    actionCb(row: Product)
    {
        const { id } = row;
        const inputData: any = {
            id: id,
            accountId: this.accountId,
            data: row
        };
        this.showPopup(inputData, { text: `Products/ Services`, desc: 'Manage Products/ Services' });
    }

    createNew()
    {
        const inputData: any = {
            id: null,
            accountId: this.accountId,
            data: {
                vendorId: this.vendorId
            }
        };
        this.showPopup(inputData, { text: `Products/ Services`, desc: 'Manage Products/ Services' });
    }

    showPopup(inputData, header)
    {
        const popup = {
            header: header,
            aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75
        };

        const success = (resp: any)=>
        {
            super.populateGrid();
            this.sharedService.destroy();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(ProductFormComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
