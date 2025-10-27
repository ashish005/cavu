import {Component, Directive, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM, OrgOptions} from "@app-global";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjectService} from "../services/project.service";
import {Project} from "../domains/project.serializer";
import {ProjectForm} from "../forms/project.form";
import {ProjectAPIResolver} from "../services";

@Component({
  standalone: false,
    templateUrl: `./templates/project-ce.html`
})
export class ProjectCEComponent extends ProjectForm {
    public options: OrgOptions;
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() set data(item: Project) {
        super.populateProject(item);
    };
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public override fb: FormBuilder,
                public apiResolver: ProjectAPIResolver,
                private service: ProjectService) {
        super(fb);
        //this.options = this.coreService.orgSetup.options;
    }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) { return; }

        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit({ refresh: true });
        };

        const error = (resp)=> {
            this.submitted = false;
        };

        this.submitted = true;
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, form.value).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(form.value).subscribe(success, error);
        }
    }
}
