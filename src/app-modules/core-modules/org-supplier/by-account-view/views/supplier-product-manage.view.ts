import {GridUISwitchCellComponent, ViewExtender, SharedService } from "@app-global";
import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SupplierFacilityService} from "../services/vendor.service";
import {VendorProduct, VendorProductQueryOptions} from "../domains/vendor-product.serializer";
import {VendorByIdAPIResolver} from "../services/api.resolver";

@Component({
    styles: [`:host { display: contents;}`],
    templateUrl: './templates/default-view.html',
  standalone: false
})
export class SupplierProductManageView extends ViewExtender<VendorProduct> implements OnInit {
    header: any = { text: 'Executive', options:[] };
    override coreState: VendorProductQueryOptions = new VendorProductQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: SupplierFacilityService,
                protected sharedService: SharedService, public apiResolver: VendorByIdAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Product', field: 'name' },
            // {headerName: 'Barcode', cellTemplate: ProductBarcodeCell},
            // {headerName: 'Brand', cellTemplate: ProductBrandCell},
            // {headerName: 'Type', field: 'productType', cellTemplate: ProductTypeNameCell },
            // {headerName: 'Selling Price', cellTemplate: ProductPriceCell},
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ]
    }
    id: string;
    vendorId: string;
    accountId: string;

    ngOnInit(){
        const { data, parent } = this.activatedRoute.snapshot;
        //const { productId, vendorId} = parent.params;
        const { id, accountId, vendorId } = parent.data['item']?.data;
        this.id = id;
        this.vendorId = vendorId;
        this.accountId = accountId;
        (<any>this.coreState).vendorId = vendorId;//this.apiResolver.vendor.id;
        (<any>this.coreState).accountId = accountId;//this.apiResolver.vendor.id;
        super.populateGrid();
    }

    actionCb(row: VendorProduct)
    {
        const { id } = row;
        const inputData: any = {
            id: id,
            accountId: this.accountId,
            data: row
        };
        //this.showPopup(inputData, { text: `Products/ Services`, desc: 'Manage Products/ Services' });
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
        //this.showPopup(inputData, { text: `Products/ Services`, desc: 'Manage Products/ Services' });
    }

    showPopup(inputData, header)
    {
        /*const popup = {
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
        modal$.then(success, failure);*/
    }
}
