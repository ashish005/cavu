import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM, SharedService, ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../domains/product.serializer";
import {ProductPriceService, ProductVariantService} from "../services/product.service";
import {ProductPriceVariant, ProductVariant, ProductVariantQueryOptions} from "../domains/product-variant.serializer";

@Component({
    templateUrl: `./templates/manage-variant-ce.html`,
    styles: [`:host { display: contents;}`],
    standalone: false
})
export class ManageProductVariantCEComponent extends ViewExtender<ProductVariant> implements OnInit {
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: string;
    @Input() productId: string;
    @Input() data: Product;
    submitted: boolean = false;

    @ViewChild('variant', { static: true }) public variant;
    override coreState: ProductVariantQueryOptions = new ProductVariantQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: ProductVariantService,
                protected sharedService: SharedService) { super(activatedRoute, service); }

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
