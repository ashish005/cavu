import {Component, Injectable, Injector, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BusinessAPIResolver} from "../services/api.resolver";
import {SoftwarePrice} from "../domains/org-software-license.serializer";
import {Software} from "../domains/lookup.serializer";
import {ModulePermission} from "../domains/module-permission.serializer";
import {PricingService} from "../services/pricing.service";

@Component({
  templateUrl: './templates/pricing-info.html',
  standalone: false
})
export class PricingInfoView implements OnInit {
    software: SoftwarePrice = new SoftwarePrice();
    activeSoftware: Software;
    modulePermissions: Array<ModulePermission> = [];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                private pricingService: PricingService, 
                public apiResolver: BusinessAPIResolver) {
        this.activeSoftware = this.apiResolver.masterType?.softwares[0];
    }

    ngOnInit(){ 
        this.fetchSectorDetails();
        this.fetchModulePermissions();
    }

    showBySoftware(software: any){
        this.activeSoftware = software;
        this.fetchSectorDetails();
        this.fetchModulePermissions();
    }

    fetchSectorDetails(){
        const success = (r: { data: SoftwarePrice })=>
        {
            this.software = new SoftwarePrice(r.data);
        };
        const failure = (r: any)=>{};
        const { id } = this.activeSoftware;
        this.pricingService.getPlans(id).subscribe(success, failure);
    }

    fetchModulePermissions(){
        const { code } = this.activeSoftware;
        const success = (r: any) => {
            this.modulePermissions = r.entities || [];
        };
        const failure = (r: any) => {
            this.modulePermissions = [];
        };
        this.pricingService.getModules(code).subscribe(success, failure);
    }
}
