import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductToken, ProductTokenQueryOptions} from "../domains/product-token.serializer";
import {ProductTokenService} from "../services/product.service";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, ViewExtender, GridUISwitchCellComponent} from "@app-global";
import {ProductTokenCEComponent} from "../components/product-token-ce.component";

@Component({
  standalone: false,
    templateUrl: './templates/default-view.html'
})
export class ProductTokenView extends ViewExtender<ProductToken> implements OnInit{
  override coreState: ProductTokenQueryOptions = new ProductTokenQueryOptions();
    constructor(public override service: ProductTokenService,
                private router: Router,
                public override activatedRoute: ActivatedRoute,
                protected sharedService: SharedService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    //get productId() { return this.activatedRoute.parent.snapshot.params.productId; }

    ngOnInit(){
      const { productId } = this.activatedRoute.parent.snapshot.params;
        (<any>this.coreState).productId = productId;
        super.populateGrid();
    }
    actionCb(row: ProductToken)
    {
        const inputData: any = {
            id: row.id,
            data: row
        };
        this.showVendorBranchPopup(inputData, {text: `Product`, desc: '' });
    }

    createNew(){
        // const data = new ProductToken();
        // data.productId = this.productId;
        // const inputData: any = {
        //     id: null,
        //     data: data
        // };
        // this.showVendorBranchPopup(inputData, {text: 'New Vendor', desc: 'New Vendor is getting created' });
    }

    showVendorBranchPopup(inputData, popupHeader){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            this.populateGrid();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(ProductTokenCEComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
