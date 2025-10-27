import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {Subscription} from "rxjs";
import {OrgIntegrationAPIResolver} from "../services/api.resolver";

export class Integration {
    id: string;
    name: string;
    desc: string;
    logoUrl: string;
    style: string;
    link: string;

    constructor(model: any = <any>{}){
        const { id, name, desc, logoUrl, style, link}  = model;
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.logoUrl = logoUrl;
        this.style = style;
        this.link = link;
    }
}

@Component({
    templateUrl: './templates/integration-references.html',
    styles: [`:host { display: contents; }`]
})
export class IntegrationReferencesComponent implements OnInit, OnDestroy {
    @Input() key: string;
    subscription : Subscription;
    isLoading: boolean = false;
    entities: Array<any>;
    constructor(public orgService: OrgIntegrationAPIResolver) { }

    ngOnInit(){
        this.isLoading = true;
        const success = (r)=>{ this.isLoading = false; this.entities = r.entities; };
        const failure = ()=>{ this.isLoading = false; };
        this.subscription = this.orgService.getOrgIntegrationReferences(this.key).subscribe(success, failure);
    }

    ngOnDestroy(){ this.subscription?.unsubscribe(); }
}