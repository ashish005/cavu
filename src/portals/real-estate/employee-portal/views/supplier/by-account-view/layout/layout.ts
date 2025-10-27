import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit, TemplateRef} from "@angular/core";
import {VendorByIdAPIResolver, VendorLookupResolver} from "../services/api.resolver";
import {SharedService} from "@app-global";

@Component({
  templateUrl: './templates/layout.html',
  standalone: false
})
export class SupplierSideNavLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    vendorId: string;
    constructor(private router: Router, public moduleResolver: VendorByIdAPIResolver,
                public apiResolver: VendorLookupResolver,
                public activatedRoute: ActivatedRoute,
                public sharedService: SharedService){}

    ngOnInit(){}

    goBack(){
        this.router.navigate(['../manage'], {relativeTo: this.activatedRoute.parent});
    }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    routerChange(nav){
        this.router.navigate([nav.route], { state: { data: { vendorId: this.vendorId } }, relativeTo: this.activatedRoute});
    }

    /* actionRemoveCb(row){
         const success = ()=>{
             this.populateGrid();
         };
         const failure = (e)=>{
             console.log(e)
         };
         this.apiResolver.deleteVoucher(row.voucherId, row.voucherTypeId).subscribe(success, failure);
     }*/
}
