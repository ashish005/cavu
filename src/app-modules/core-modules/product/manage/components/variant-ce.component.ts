import {ACTION_ENUM, ViewExtender, SharedService} from "@app-global";
import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ProductVariantService} from "../services/product.service";
import {ProductPriceVariant, ProductVariant, ProductVariantQueryOptions} from "../domains/variant.serializer";
import {ProductById} from "../domains/product-id.serializer";

@Component({
  standalone: false,
    templateUrl: `./templates/variant-ce.html`,
    styles: [`:host { display: contents;}`]
})
export class ProductVariantCEComponent extends ViewExtender<ProductVariant> implements OnInit {
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: string;
    @Input() productId: string;
    @Input() data: ProductById;
    submitted: boolean = false;
    @ViewChild('variant', { static: true }) public variant;
    override coreState: ProductVariantQueryOptions = new ProductVariantQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: ProductVariantService) {
        super(activatedRoute, service);
    }

    ngOnInit(){
        (<ProductVariantQueryOptions>this.coreState).productId = this.productId;
        super.populateGrid();
    }

    createNew(){
        const variant = new ProductVariant();
        variant.productId = this.productId;
        this.gridRow = variant;
    }

    onRowClick(row: ProductVariant){
        this.gridRow = row;
    }

    callback(e){
        super.populateGrid();
    }
}
