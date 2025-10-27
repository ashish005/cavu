import {Component, Directive, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjectAssociateForm} from "../forms/project-associate.form";
import {ProjectResource} from "../domains/project-resource.serializer";
import {of} from "rxjs";
import {ProjectAPIResolver, ProjectByIdAPIResolver, ProjectResourceService} from "../services";
import {ACTION_ENUM} from "@app-global";

@Component({
  standalone: false,
    templateUrl: `./templates/project-associate-ce.html`
})
export class ProjectAssociateCEComponent extends ProjectAssociateForm {
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() projectId: any;
    @Input() set data(item: ProjectResource) {
        this.customForm.patchValue(<any>item);
    };
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public override fb: FormBuilder, public apiResolver: ProjectAPIResolver,
                public projectResolver: ProjectByIdAPIResolver, private service: ProjectResourceService) {
        super(fb);
        //this.projectResolver.project.modules;
    }

    popoverCallback(e: any)
    {
    }

    public typeAheadServiceCall = (item)=>{
        return (item.length > 2) ? this.service.read(item):of({entities: []});
    }

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
        form.value.projectId = this.projectId;

        /*const url = this.service.viewUrl.replace('{id}', this.projectId);
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, form.value, `${url}/${this.id}`).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(form.value, url).subscribe(success, error);
        }*/
    }
}
