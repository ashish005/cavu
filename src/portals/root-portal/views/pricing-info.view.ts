import {Component, Injectable, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "@app-environments";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {BusinessAPIResolver} from "../services/api.resolver";
import {SoftwarePrice} from "../domains/org-software-license.serializer";
import {Software} from "../domains/lookup.serializer";

@Injectable()
export class PricingService {
    public viewUrl = `${environment.authBaseUrl}/software/plans/1.0.0`;
    constructor(protected httpClient: HttpClient) {}

    public read(softwareId: any): Observable<any> {
        return this.httpClient.get(`${this.viewUrl}/${softwareId}`)
            .pipe(
                tap(data => data),
                catchError(error => error)
            );
    }
}

@Component({
  templateUrl: './templates/pricing-info.html',
  standalone: false,
    providers: [PricingService]
})
export class PricingInfoView implements OnInit {
    software: SoftwarePrice = new SoftwarePrice();
    activeSoftware: Software;

    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                private pricingService: PricingService, public apiResolver: BusinessAPIResolver) {
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
