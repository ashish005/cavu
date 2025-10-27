import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { GridUISwitchCellComponent, ViewExtender, ASIDE_CLASS, ASIDE_SIZE, SharedService } from "@app-global";
import {Product, ProductQueryOptions} from "../domains/product.serializer";
import {ProductService} from "../services/product.service";
import { ProductBarcodeCell, ProductBrandCell, ProductNameActionCell, ProductPriceCell, ProductTypeNameCell } from "../grid-cells";
import {ProductFormComponent} from "../components/product-form.view";

@Component({
  standalone: false,
  templateUrl: './templates/manage.html'
})
export class ProductManageView extends ViewExtender<Product> implements OnInit {
    header: any = { text: 'Executive', options:[] };
    override coreState: ProductQueryOptions = new ProductQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
                public override service: ProductService,
                protected sharedService: SharedService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'grid.header.name', field: 'name', cellTemplate: ProductNameActionCell },
            {headerName: 'grid.header.barcode', cellTemplate: ProductBarcodeCell},
            {headerName: 'grid.header.brand', cellTemplate: ProductBrandCell},
            {headerName: 'grid.header.type', field: 'productType', cellTemplate: ProductTypeNameCell },
            {headerName: 'grid.header.selling_price', cellTemplate: ProductPriceCell},
            {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
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
