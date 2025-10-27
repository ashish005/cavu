import {Component} from "@angular/core";
import {SharedService, DynamicComponent} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../services/product.service";

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
    constructor(private router: Router, public activatedRoute: ActivatedRoute, public sharedService: SharedService){ super(); }
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
    constructor(private router: Router, public activatedRoute: ActivatedRoute, public sharedService: SharedService){ super(); }
}

@Component({
  standalone: false,
    template: `<div class="d-block" *ngIf="context?.variants?.length">
        <a class="text-xs text-muted item-title">{{ context.variants[0].barCode }}</a>
        <div class="item-except text-sm text-muted h-1x">{{ context.variants[0].sku }}</div></div>`
})
export class ProductBarcodeCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute, public sharedService: SharedService){ super(); }
}

@Component({
  standalone: false,
    template: `<div class="d-block" *ngIf="context?.variants?.length && context?.variants[0]?.prices?.length"><a class="text-xs item-title">{{ context.variants[0].prices[0].supplyPrice }}</a></div>`
})
export class ProductPriceCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute, public sharedService: SharedService){ super(); }
}

@Component({
  standalone: false,
    template: `<div class="flex d-flex">
        <div class="list-body">
            <a class="_500" (click)="showDetails(context)">{{ context?.name }}</a>
            <span *ngIf="context.code" class="b-r mx-1"> {{context.code}} </span>
            <div class="item-except text-sm h-1x">
                <a class="text-danger text-xs _500" *ngIf="!context.variantCount"> No Variant</a>
                <small *ngIf="context.variantCount">{{ context.variantCount }} + </small>
                <a class="text-primary text-xs _500" *ngIf="context.variantCount" (click)="manageVariants()"> Add Variants</a>
                <a (click)="assignServiceToVendor()" class="pl-2" [class.text-danger]="!(context?.vendorId)"> {{context?.vendor || 'Vendor' }} </a>
                {{ context?.description }}
            </div>
        </div>
        <div>
            <small class="text-muted px-2"> {{context.taxInfo?.name }}</small>
        </div>
    </div>`
})
export class ProductNameActionCell extends DynamicComponent{
    constructor(private router: Router, public activatedRoute: ActivatedRoute, private service : ProductService, public sharedService: SharedService){ super(); }

    showDetails(row){
        this.router.navigate(['..', row.id], {relativeTo: this.activatedRoute.parent.parent});
    }

    manageVariants()
    {
        /*const inputData: any = {
            id: null,
            productId: this.context.id,
            data: this.context
        };
        const popup = {
            header: { text: `Manage Variant`, desc: 'Manage Variant creation screen' },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            this.context.variantCount += 1;
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(ManageProductVariantCEComponent, popup, inputData);
        modal$.then(success, failure);*/
    }

    assignServiceToVendor()
    {
        /*const inputData: any = {
            id: null,
            productId: this.context.id,
            data: this.context
        };
        const popup = {
            header: { text: `Assign To Vendor`, desc: '' },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_25
        };

        const success = (resp: any)=>{
            const success = (item)=>
            {
                this.sharedService.destroy();
                this.context.vendorId =  resp.id;
                this.context.vendor = resp.tradeName;
            };
            const failure = (r)=> {};
            this.service.mapProductToVendor(this.context.id, { vendorId: resp.id }).subscribe(success, failure);
        };
        const failure = ()=>{ this.sharedService.destroy(); };
        let modal$ = this.sharedService.showCustomPopup(AssignToVendorComponent, popup, inputData);
        modal$.then(success, failure);*/
    }
}
