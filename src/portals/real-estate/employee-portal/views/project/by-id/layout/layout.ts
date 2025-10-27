import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectAPIResolver, ProjectByIdAPIResolver} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html'
})
export class ProjectSideNavLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    projectId: string;
    moduleId: string;

    public items : Array<any>;
    public reportItems: any = {
        name: "Reports",
        children:[
            { id:11, icon:"fa fa-graduation-cap", key: "reports.acc_statement", sortOrder: 1 },
            { id:12, icon:"fa fa-graduation-cap", key: "reports.invoice_details", sortOrder: 1 },
            { id:13, icon:"fa fa-location-arrow", key: "reports.project_revenue", sortOrder: 1 },
            { id:14, icon:"fa fa-folder-open", key: "reports.payment_collected", sortOrder: 1 },
            { id:15, icon:"fa fa-folder-open", key: "reports.time_entry", sortOrder: 1 }
        ]
    };

    constructor(private router: Router, public activatedRoute: ActivatedRoute, public apiResolver: ProjectAPIResolver, public projectResolver: ProjectByIdAPIResolver)
    {
        const translatePath = "";//this.activatedRoute.snapshot.data.translatePath;
        this.items = [
            { id:1, icon:"fa fa-dashboard", route: `dashboard`, key: `${translatePath}.dashboard.name`, sortOrder: 1 },
            { id:9, icon:"fa fa-tag", route: `modules`, key: `${translatePath}.module.name`, sortOrder: 2 },
            { id:10, icon:"fa fa-users", route: 'resource', key: `${translatePath}.resource.name`, sortOrder: 3 },

            { id:3, icon:"fa fa-pie-chart", route: 'invoice', key: `${translatePath}.invoice.name`, sortOrder: 4 },
            { id:7, icon:"fa fa-shield", route: 'quotation', key: `${translatePath}.quote.name`, sortOrder: 5 },
            { id:11, icon:"fa fa-envelope", route: 'recurring', key: `${translatePath}.rec_invoice.name`, sortOrder: 6 },
            //{ id:12, icon:"fa fa-folder-open", route: 'retainer', name: "sideOptions.retainers", sortOrder: 1 },
            { id:12, icon:"fa fa-folder-open", route: 'workflow', key: `${translatePath}.workflow.name`, sortOrder: 1 },
            { id:12, icon:"fa fa-folder-open", route: 'status-tracking', key: `${translatePath}.tracking.name`, sortOrder: 1 }
        ];
    }

    ngOnInit(){
      const { projectId } = this.activatedRoute.snapshot.params;
      this.projectId = projectId;
    }

    goBack() { this.router.navigate(['../', 'manage'], {relativeTo: this.activatedRoute.parent}); }

    onActivate(componentRef){
        componentRef.projectId = this.projectId;
        componentRef.accountId = this.projectResolver.project.customerId;
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    routerChange(nav){
        this.router.navigate([nav.route], { relativeTo: this.activatedRoute});
    }
    onModuleChange(moduleId)
    {
        this.moduleId = moduleId;
    }
}
