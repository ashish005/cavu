import {ActivatedRoute} from "@angular/router";
import {ProjectAPIResolver} from "../services";
import {Component, TemplateRef} from "@angular/core";

@Component({
  standalone: false,
  templateUrl: './templates/workflow.html'
})
export class WorkflowLayout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    pageTitle: string;
    pageIcon: string;
    desc: string;
    constructor(public activatedRoute: ActivatedRoute, public apiResolver: ProjectAPIResolver){
        const { data, parent} = this.activatedRoute.snapshot;
        // this.pageTitle = data.header || parent?.data?.header;
        // this.pageIcon = data.icon || parent?.data?.icon;
        // this.desc = data.title || parent?.data?.desc;
    }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}
