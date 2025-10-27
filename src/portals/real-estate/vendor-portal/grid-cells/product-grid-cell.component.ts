import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DynamicComponent} from "@app-global";

@Component({
  standalone: false,
    template: `<div class="flex d-flex">
        <div class="list-body">
            <a class="text-xs text-muted item-title">{{ context?.productType }}</a>
            <div class="item-except text-sm text-muted h-1x">
                {{ context.supplyType }}{{ context.procurementType }}
            </div>
        </div>
    </div>`
})
export class ProductTypeNameCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}

@Component({
  standalone: false,
    template: `<div class="flex d-flex">
        <div class="list-body">
            <a class="text-xs text-muted item-title">{{ context.brand }}</a>
            <div class="item-except text-sm text-muted h-1x">
                {{ context.supplyType }}
            </div>
        </div>
    </div>`
})
export class ProductBrandCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}

@Component({
  standalone: false,
    template: `<div class="d-block" *ngIf="context?.variants?.length">
        <a class="text-xs text-muted item-title">{{ context.variants[0].barCode }}</a>
        <div class="item-except text-sm text-muted h-1x">{{ context.variants[0].sku }}</div></div>`
})
export class ProductBarcodeCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}

@Component({
  standalone: false,
    template: `<div class="d-block" *ngIf="context?.variants?.length && context?.variants[0]?.prices?.length"><a class="text-xs item-title">{{ context.variants[0].prices[0].supplyPrice }}</a></div>`
})
export class ProductPriceCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute){ super(); }
}
