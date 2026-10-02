import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {SoftwareLookup} from "../domains/lookup.serializer";
import {SoftwareSetupResolver} from "../services/api.resolver";

@Component({
    standalone: false,
    templateUrl: './templates/layout.html'
})
export class SoftwareLayout implements OnInit {
    software: SoftwareLookup;
    softwares: SoftwareLookup[];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: SoftwareSetupResolver){}
    ngOnInit() {
        this.softwares = this.apiResolver.lookup.softwares || [];
        this.changeSystemRoute(this.softwares[0]);
    }
    changeSystemRoute(software: SoftwareLookup){
        this.software = software;
        this.router.navigate([software.code],{ relativeTo: this.activatedRoute });
    }
    onActivate(componentRef){}
}

@Component({
    standalone: false,
    templateUrl: './templates/sub-layout.html'
})
export class SoftwareSubLayout implements OnInit, OnDestroy {
    software: SoftwareLookup;
    paramsSubscription: Subscription;
    public navList: Array<any> = [
        { id:1, icon:"fa fa-dashboard", routeTo: 'plan', key: "Plan", sortOrder: 1 },
        { id:2, icon:"fa fa-dashboard", routeTo: 'modules', key: "Modules", sortOrder: 2 },
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: SoftwareSetupResolver){}

    ngOnInit() {
        this.paramsSubscription = this.activatedRoute.params.subscribe((parms: { code: string }) =>
        {
            this.software = this.apiResolver.lookup.getSoftwareByCode(parms.code);
        });
    }
    ngOnDestroy() {
        this.paramsSubscription?.unsubscribe();
    }

    onActivate(componentRef){}
}