import {Component, TemplateRef} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProjectAPIResolver} from "../services";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {MasterTypeLayout, OrgWiseProjectProcessWorkflowView} from "../components";

@Component({
  templateUrl: './templates/layout.html',
  standalone: false
})
export class ProjectLayout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;

    constructor(public activatedRoute: ActivatedRoute, public sharedService: SharedService, public apiResolver: ProjectAPIResolver){
    }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    showProjectOrgProcess(){
        const inputData = {
            id: null,
            isCenterAlign: true,
            masterType: 'PROJECT_MANAGEMENT'
        };

        const popup = {
            header: { text: `Default Project Stages: Organization wide`, desc: `This is default workflow applicable for every Project` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(OrgWiseProjectProcessWorkflowView, popup, inputData);
        modal$.then(success, failure);
    }

    showMasterTypePopup() {
        const inputData = {};

        const popup = {
            header: { text: `Project Master`, desc: `Project Master` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(MasterTypeLayout, popup, inputData);
        modal$.then(success, failure);
    }
}
