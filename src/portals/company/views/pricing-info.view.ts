import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SoftwarePrice} from "../domains/org-product-price.serializer";
import {TrialBusinessAPIResolver} from "../services";
import {PricingService} from "../services/business.service";

@Component({
  templateUrl: './templates/pricing-info.html',
  standalone: false
})
export class PricingInfoView implements OnInit {
    software: SoftwarePrice = new SoftwarePrice();
    activeSoftware: any;

    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                private pricingService: PricingService, public apiResolver: TrialBusinessAPIResolver) {
        this.activeSoftware = this.apiResolver.masterType?.softwares[0];
    }

    ngOnInit(){ this.fetchSectorDetails(); }

    showBySoftware(software: any){
        this.activeSoftware = software;
        this.fetchSectorDetails();
    }

    fetchSectorDetails(){
        const success = (r: { data: SoftwarePrice })=>
        {
            this.software = new SoftwarePrice(r.data);
        };

        const failure = (r: any)=>{};

        this.pricingService.read(this.activeSoftware.id).subscribe(success, failure);
    }
}
