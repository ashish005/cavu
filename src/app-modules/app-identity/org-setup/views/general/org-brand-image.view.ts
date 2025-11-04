import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrgService} from "../../services/org.service";

@Component({
    standalone: false,
    templateUrl: './templates/org-brand-image.html',
})
export class OrgBrandImageView implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    submitted: boolean = false;
    constructor(public fb: FormBuilder, public service: OrgService) {
    }

    ngOnInit(){}
    updateOrgImage(fileDocument: any){
        const successAction = (resp)=> {};
        const progressCb = ()=> {};
        this.service.updateOrganizationProfile(fileDocument, successAction, progressCb);
    }
}