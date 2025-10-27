import {Component, OnInit} from "@angular/core";
import {DynamicComponent} from "@app-global";
import {VendorLookupResolver} from "../services/api.resolver";

@Component({
  standalone: false,
    template: `<div>
        <a class="text-sm _500">{{ context?.tradeName }}</a>
        <div class="item-except text-xs h-1x">
            <a class="btn btn-xs text-xs btn-outline mx-1" (click)="addBranch()"><i class="fa fa-plus"></i> Branch</a>
            <a class="btn btn-xs text-xs btn-outline mx-1" (click)="addBrand()"><i class="fa fa-plus"></i> Brand</a>
        </div>
    </div>`
})
export class VendorNameActionCell extends DynamicComponent{
    constructor(public apiResolver: VendorLookupResolver){ super(); }

    addBranch(){
        const { id, tradeName } = this.context;
        const inputData: any = {
            id: null,
            vendorId: id,
            accountId: null
        };
        this.apiResolver.showVendorBranchPopup(inputData, {text: `${tradeName}`, desc: '' }, (resp: any)=>{

        });
    }
    addBrand(){
        const { id, tradeName } = this.context;
        const inputData: any = {
            id: null,
            vendorId: id
        };
        this.apiResolver.showVendorBrandPopup(inputData, {text: `${tradeName}`, desc: '' }, (resp: any)=>{});
    }
}
