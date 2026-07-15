import {Component, Injectable, Injector, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, Observable, tap} from "rxjs";
import {BusinessAPIResolver} from "../services/api.resolver";
import {SoftwarePrice, SoftwarePriceSerializer} from "../domains/org-software-license.serializer";
import {Software} from "../domains/lookup.serializer";
import {ModulePermission} from "../domains/module-permission.serializer";
import {CoreResourceService} from "@app-global";
import {ModulePermissionGridComponent} from "../components/module-permission-grid.component";

@Injectable()
export class PricingService extends CoreResourceService<SoftwarePrice>{
    constructor(public override injector: Injector) { super(injector, 'software', new SoftwarePriceSerializer());}
    // public viewUrl = `${environment.authBaseUrl}/software`;
    // constructor(protected httpClient: HttpClient) {}
    public getPlans = (softwareId: any) => this.httpClient.get(`${this.viewUrl}/plans/${softwareId}`, this.requestHeaders);
    public getModules = (softwareCode) => this.httpClient.get(`${this.viewUrl}/sector/${softwareCode}/modules`, this.requestHeaders);
}

@Component({
  templateUrl: './templates/pricing-info.html',
  standalone: false,
    providers: [PricingService]
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
