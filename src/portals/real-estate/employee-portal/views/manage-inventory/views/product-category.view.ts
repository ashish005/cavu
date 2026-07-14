import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductCategoryService, ProductTokenService} from "../services/product.service";
import {ProductCategory, ProductCategoryQueryOptions} from "../domains/product-category.serializer";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
  standalone: false,
    templateUrl: './templates/default-view.html'
})
export class ProductCategoryView extends ViewExtender<ProductCategory> implements OnInit{
  override coreState: ProductCategoryQueryOptions = new ProductCategoryQueryOptions();
    constructor(public override service: ProductCategoryService,
                private router: Router, public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){
      const { productId } = this.activatedRoute.parent.snapshot.params;
        (<any>this.coreState).productId = productId;
        super.populateGrid();
    }

    createNew(){}
  actionCb(e){}
}
