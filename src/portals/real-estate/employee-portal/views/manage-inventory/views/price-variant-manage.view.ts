import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { ASIDE_CLASS, ASIDE_SIZE, SharedService, ViewExtender } from "@app-global";
import { ProductVariantService } from "../services/product.service";
import {ProductVariantCEComponent} from "../components/product-variant-ce.component";
import {
    VariantBarcodeCell,
    VariantBrandCell, VariantItemOtherPriceActionCell,
    VariantItemPriceActionCell,
    VariantNameActionCell, VariantProductTypeCell
} from "../grid-cells/variant-grid-cell.component";
import {ProductAPIResolver} from "../services/api.resolver";
import { ProductVariant, ProductVariantQueryOptions } from "../domains/product-variant.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/manage-product-variant.html'
})
export class ProductPriceVariantManageView extends ViewExtender<ProductVariant> implements OnInit {
    hideOption: boolean = true;
    override coreState: ProductVariantQueryOptions = new ProductVariantQueryOptions();
    header: any = { text: 'Executive', options:[] };
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: ProductVariantService, public apiResolver: ProductAPIResolver,
                protected sharedService: SharedService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Product', field: 'name', cellTemplate: VariantNameActionCell },
            {headerName: 'Barcode', cellTemplate: VariantBarcodeCell },

            {headerName: 'Product Type', cellTemplate: VariantProductTypeCell },
            {headerName: 'MRP/ Retail Price', cellTemplate: VariantItemPriceActionCell },
            {headerName: 'Cost Price', cellTemplate: VariantItemOtherPriceActionCell },
            {headerName: 'Brand', cellTemplate: VariantBrandCell },
            //{headerName: 'Audit', field: 'userAudit', class: 'float-right', cellTemplate: UserAuditInfoCell }
        ]
    }

    ngOnInit(){
        (<any>this.coreState).productId = this.apiResolver.product.id;
        super.populateGrid();
    }

    variantCallback(e: { refresh: boolean })
    {
        super.populateGrid();
    }

    variantPriceCallback(e: { refresh: boolean })
    {
        super.populateGrid();
    }

    actionCb(row: any){
        const inputData: any = {
            id: row.id,
            productId: row.variant.productId,
            data: row
        };

        const { name } = row.variant || {};
        this.addUpdatePriceVariantPopup(inputData, { text: `${name}`, desc: `Update changes for ${name}` });
    }

    createNew()
    {
        const inputData: any = {
            id: null,
            productId: this.apiResolver.product.id,
            data: null
        };
        this.addUpdatePriceVariantPopup(inputData, { text: `Create Variant`, desc: `` });
    }

    addUpdatePriceVariantPopup(inputData: any, header){
        const popup = {
            header: header,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            super.populateGrid();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(ProductVariantCEComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
