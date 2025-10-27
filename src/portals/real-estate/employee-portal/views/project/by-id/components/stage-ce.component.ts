import {Component, Input, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ProjectAPIResolver, ProjectModuleService} from "../services";
import {LookupStatus} from "../domains/project.lookup";

@Component({
  standalone: false,
    templateUrl: `./templates/stage-ce.html`
})
export class StageCeComponent {
    @Input() moduleId: any;
    @Input() projectId: any;
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public fb: FormBuilder,
                public apiResolver: ProjectAPIResolver,
                private service: ProjectModuleService) {
    }

    onStartChange(stage: LookupStatus, dt: string, isStarted: boolean){
        const success = (resp)=> {
            this.submitted = false;
            //this.onOk.emit({ refresh: true });
        };

        const error = (resp)=> {
            this.submitted = false;
        };

        const data = {
            processId: null,
            statusId: stage.id,
            moduleId: this.moduleId,
            dt: dt,
            //employeeUserId: this.service.employeeUserId,
            isStarted: isStarted
        };
        this.service.updateStatus(data).toPromise().then(success, error);
    }
}
