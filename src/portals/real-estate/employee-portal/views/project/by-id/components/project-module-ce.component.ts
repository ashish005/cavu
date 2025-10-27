import {Component, Input, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ProjectModule} from "../domains/project-module.serializer";
import {ACTION_ENUM} from "@app-global";
import {ProjectAPIResolver, ProjectModuleService} from "../services";
import {ProjectServiceForm} from "../forms/project-service.form";

@Component({
  standalone: false,
    templateUrl: `./templates/project-module-ce.html`
})
export class ProjectModuleCeComponent extends ProjectServiceForm {
    @Input() id: any;
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() set data(item: ProjectModule) { super.populateProjectService(item); };

    //@Input() projectId: any;
    //@Input() customerId: any;
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public override fb: FormBuilder, public apiResolver: ProjectAPIResolver, public service: ProjectModuleService) { super(fb); }

    ngOnInit(){
        /*if(this.projectId){
            this.getProjectServices(this.projectId);
        }*/
    }

    /*getProjectServices(projectId: string){
        this.isLoading = true;
        const queryOptions = new ProjectModuleQueryOptions();
        queryOptions.projectId = this.projectId;
        //queryOptions.customerId = this.customerId;
        this.service.list(queryOptions).subscribe((resp: any)=> {
            this.serviceList = resp.entities;
            this.isLoading = false;
        });
    }

    newService(){
        super.populateProjectService(<ProjectModule>{});
    }

    applyService(row: ProjectModule){
        this.id = row.id;
        super.populateProjectService(row);
    }*/

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit({ refresh: true });
        };
        const error = (resp)=> {
            this.submitted = false;
        };

        this.submitted = true;
        if(this.id) {
            this.service.update(this.id, form.value).subscribe(success, error);
        } else {
            this.service.create(form.value).subscribe(success, error);
        }
    }
}
