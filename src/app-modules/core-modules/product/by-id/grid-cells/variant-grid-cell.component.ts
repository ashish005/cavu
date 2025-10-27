import {Component} from "@angular/core";
import {SharedService, DynamicComponent} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
    template: `<div class="flex d-flex">
        <div class="list-body">
            <a class="text-xs _500">{{ context.variant.barCode || '--' }}</a>
        </div>
    </div>`
})
export class VariantBarcodeCell extends DynamicComponent{
    constructor(public activatedRoute: ActivatedRoute, public sharedService: SharedService){ super(); }
}

@Component({
  standalone: false,
    template: `<div class="flex d-flex">
        <div class="list-body">
            <a class="_500">{{ context?.variant?.name }}</a>
            <div class="item-except text-sm text-muted h-1x">
                {{ context?.variant?.product }}
            </div>
        </div>
        <div>
            <span class="">{{context?.variant?.taxInfo?.name}}</span>
            <div class="item-except text-xs h-1x"><small>{{(context?.isTaxInclusive)? 'Tax Inclusive': 'Tax Exclusive'}}</small></div>
        </div>
    </div>`
})
export class VariantNameActionCell extends DynamicComponent{
    constructor(public activatedRoute: ActivatedRoute, public sharedService: SharedService){ super(); }
}

@Component({
  standalone: false,
    template: `<div class="flex d-flex">
        <div class="list-body">
            <a class="_500">{{ context?.variant?.brand }}</a>
            <div class="item-except text-sm text-muted h-1x">{{ context?.variant?.division }}</div>
        </div>
    </div>`
})
export class VariantBrandCell extends DynamicComponent{
    constructor(public activatedRoute: ActivatedRoute, public sharedService: SharedService){ super(); }
}

@Component({
  standalone: false,
    template: `<span class="text-xs">{{ context?.variant?.productType }}</span>`
})
export class VariantProductTypeCell extends DynamicComponent{
    constructor(public activatedRoute: ActivatedRoute, public sharedService: SharedService){ super(); }
}

@Component({
  standalone: false,
    template: `<div class="flex d-flex">
        <div class="list-body">
            <a class="text-xs _500">{{ context.mrp | orgCurrency }} / {{ context?.retailPrice | orgCurrency }}</a>
            <div class="item-except text-xs h-1x">
                <small class="text-muted" [class.text-l-t]="!context?.isFixedPrice">Fixed Price</small>
            </div>
        </div>
    </div>`
})
export class VariantItemPriceActionCell extends DynamicComponent{
    constructor(public activatedRoute: ActivatedRoute, public sharedService: SharedService){ super(); }
}

@Component({
  standalone: false,
    template: `<a class="text-xs _500">{{ context?.supplyPrice | orgCurrency }}</a>`
})
export class VariantItemOtherPriceActionCell extends DynamicComponent{
    constructor(public activatedRoute: ActivatedRoute, public sharedService: SharedService){ super(); }
}
