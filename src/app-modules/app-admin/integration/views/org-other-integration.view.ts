import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs"
import {AllSection, CommunicationSection, OrgIntegration} from "../domains/org-integration.serializer";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {OrgIntegrationAPIResolver} from "../services/api.resolver";
import {CommunicationGatewayCEComponent} from "../components/communication-gateway-ce.component";

@Component({
    standalone: false,
    templateUrl: './templates/org-other-integration.html'
})
export class OrgOtherIntegrationView implements OnInit {
    page: any;
    subscription : Subscription;
    list: OrgIntegration;
    constructor(public lookupResolver: OrgIntegrationAPIResolver, public sharedService: SharedService, public activatedRoute: ActivatedRoute){
        //this.page = this.activatedRoute.snapshot.data;
    }

    ngOnInit(){
        const key = this.activatedRoute.snapshot.routeConfig.path;
        const { masterType }  = this.lookupResolver;
        this.page = masterType.items.find(r => r.key == key);
        this.list = masterType[key];
    }

    editCommunication(row: CommunicationSection)
    {
        const {id} = row;
        const req = {
            id: id,
            data: row
        };
        const popup = {
            header: {  text:`${name}`, desc: `${name}`},
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
        };
        const failure = (e)=>{
            this.sharedService.destroy();
        };

        this.sharedService.showCustomPopup(CommunicationGatewayCEComponent, popup, req).then(success, failure);
    }

    newCommunicationTemplatePopup(type: string)
    {
        /*const {id, name, masterType} = this.lookupService.masterType.mediaType.find(r=> r.masterType==type);
        const req = {
            id: null,
            data: {
                mediaTypeId: id,
                mediaMasterType: masterType
            }
        };
        const popup = {
            header: {  text:`${name}`, desc: `${name}`},
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
          this.sharedService.destroy();
          this.fetchIntegrationDetails();
        };
        const failure = (e)=>{
          this.sharedService.destroy();
        };

        this.sharedService.showCustomPopup(CommunicationGatewayCEComponent, popup, req).then(success, failure);*/
    }
}
