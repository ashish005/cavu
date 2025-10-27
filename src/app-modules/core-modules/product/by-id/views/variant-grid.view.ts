import {ViewExtender} from "@app-global";
import {ProductVariant, ProductVariantQueryOptions} from "../domains/variant.serializer";
import {ActivatedRoute} from "@angular/router";
import {Component, Input, OnInit} from "@angular/core";
import {ProductVariantService} from "../services/product.service";

@Component({
  standalone: false,
    //selector: 'variant-grid',
    templateUrl: './templates/variant-grid.html',
  styles: [`:host{ display: contents; }`]
})
export class VariantGridComponent extends ViewExtender<ProductVariant> implements OnInit {
    @Input() productId: number;
    override coreState: ProductVariantQueryOptions = new ProductVariantQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: ProductVariantService) {
        super(activatedRoute, service);
    }
    ngOnInit(){
        if(this.productId)
        {
            (<ProductVariantQueryOptions>this.coreState).productId = this.productId;
            super.populateGrid();
        }
    }

    variantCallback(e: { refresh: boolean })
    {
        super.populateGrid();
    }

    variantPriceCallback(e: { refresh: boolean })
    {
        super.populateGrid();
    }
}
