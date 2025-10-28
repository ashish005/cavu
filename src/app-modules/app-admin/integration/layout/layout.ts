import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {Subscription} from "rxjs";
import {AllSection, CommunicationSection, OrgIntegration} from "../domains/org-integration.serializer";
import {OrgIntegrationAPIResolver} from "../services/api.resolver";

@Component({
    standalone: false,
    templateUrl: './templates/layout.html'
})
export class IntegrationLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    page: any;
    subscription : Subscription;
    section: OrgIntegration;
    constructor(public lookupResolver: OrgIntegrationAPIResolver, public sharedService: SharedService,
                public router: Router, public activatedRoute: ActivatedRoute){
        this.page = this.activatedRoute.snapshot.data;
    }

    onActivate(componentRef){ this.actionTemplate = componentRef.actionTemplate; }
    ngOnInit(){ this.fetchIntegrationDetails(); }

    fetchIntegrationDetails(){ this.section = this.lookupResolver.masterType; }

    routeToUrl=(item)=> this.router.navigate([item.key], {relativeTo: this.activatedRoute.parent});

    // showReference(row: AllSection)
    // {
    //     const {key, name} = row;
    //     const req = { key: key };
    //     const popup = {
    //         header: {  text:`${name}`, desc: `${name}`},
    //         aside: ASIDE_CLASS.RIGHT,
    //         size: ASIDE_SIZE.W_50
    //     };
    //
    //     const success = (resp: any)=>{ this.sharedService.destroy(); };
    //     const failure = (e)=>{ this.sharedService.destroy(); };
    //     this.sharedService.showCustomPopup(IntegrationReferencesComponent, popup, req).then(success, failure);
    // }
}
