import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SoftwarePlanService} from "../services/software.service";
import {SoftwareSetupResolver} from "../services/api.resolver";
import {SoftwareLookup} from "../domains/lookup.serializer";
import {SoftwarePrice} from "../domains/software.serializer";
import {Subscription} from "rxjs";

@Component({
  standalone: false,
  templateUrl: './templates/software-plan.html',
  styles: [`:host { display: contents; }`],
})
export class SoftwarePlanView implements OnInit, OnDestroy {
    softwarePlan: SoftwarePrice;
    software: SoftwareLookup;
    paramsSubscription: Subscription;
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public service: SoftwarePlanService,
                public apiResolver: SoftwareSetupResolver) {
    }

    ngOnInit()
    {
        this.paramsSubscription = this.activatedRoute.parent?.params
            .subscribe((parms: { code: string }) =>
        {
            var software = this.apiResolver.lookup.getSoftwareByCode(parms.code);
            this.changeProvider(software);
        });
    }

    changeProvider(software: SoftwareLookup) {
        this.software = software;
        const success = (r: { data: SoftwarePrice })=>
        {
            this.softwarePlan = r.data;
        };
        const failure = (r: any)=>{};
        this.service.read(`${software.id}`).subscribe(success, failure);
    }

    ngOnDestroy(){ this.paramsSubscription.unsubscribe(); }
    actionCb(row: any){}
}
