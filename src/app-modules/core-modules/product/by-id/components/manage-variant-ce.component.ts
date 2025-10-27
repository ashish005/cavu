import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import { ACTION_ENUM, SharedService, ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {ProductPriceService, ProductVariantService} from "../services/product.service";
import {ProductPriceVariant, ProductVariant, ProductVariantQueryOptions} from "../domains/variant.serializer";
import {ProductById} from "../domains/product-id.serializer";

@Component({
  standalone: false,
  templateUrl: `./templates/manage-variant-ce.html`,
  styles: [`:host { display: contents;}`]
})
export class ManageProductVariantCEComponent extends ViewExtender<ProductVariant> implements OnInit {
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
        //super.gridRow = variant;
    }

    onRowClick(row: ProductVariant){
      //super.gridRow = row;
    }

    callback(e){
        super.populateGrid();
    }
}
