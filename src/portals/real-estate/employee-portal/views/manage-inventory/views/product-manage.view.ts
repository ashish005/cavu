import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { GridUISwitchCellComponent, ViewExtender, ASIDE_CLASS, ASIDE_SIZE, SharedService } from "@app-global";
import {Product, ProductQueryOptions} from "../domains/product.serializer";
import {ProductService} from "../services/product.service";
import { ProductBarcodeCell, ProductBrandCell, ProductNameActionCell, ProductPriceCell, ProductTypeNameCell } from "../grid-cells/product-grid-cell.component";
import {ProductFormComponent} from "../components/product-form.view";

@Component({
  standalone: false,
  templateUrl: './templates/manage-product.html'
})
export class ProductManageView extends ViewExtender<Product> implements OnInit {
    header: any = { text: 'Executive', options:[] };
    override coreState: ProductQueryOptions = new ProductQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: ProductService,
                protected sharedService: SharedService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'name', field: 'name', cellTemplate: ProductNameActionCell },
            {headerName: 'barcode', cellTemplate: ProductBarcodeCell},
            {headerName: 'brand', cellTemplate: ProductBrandCell},
            {headerName: 'type', field: 'productType', cellTemplate: ProductTypeNameCell },
            {headerName: 'selling_price', cellTemplate: ProductPriceCell},
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ]
    }

    ngOnInit(){
        super.populateGrid();
    }

    // actionCb(row: Product){
    //     this.router.navigate(['form', row.id], {relativeTo: this.activatedRoute.parent.parent});
    // }

    createNew()
    {
        const inputData: any = {
            id: null,
            data: null
        };
        this.showPopup(inputData,{ text: `Create Product`, desc: 'Product Creation screen' });
    }

    actionCb(row: Product)
    {
        const { id } = row;
        const inputData: any = {
            id: id,
            // vendorId: this.vendorId,
            // accountId: this.accountId,
            data: row
        };
        this.showPopup(inputData, { text: `Edit Product`, desc: 'Edit Product' });
    }

    showPopup(inputData, header)
    {
        const popup = { header: header, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any)=>{
            super.populateGrid();
            this.sharedService.destroy();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };
        this.sharedService.showCustomPopup(ProductFormComponent, popup, inputData).then(success, failure);
    }
}
