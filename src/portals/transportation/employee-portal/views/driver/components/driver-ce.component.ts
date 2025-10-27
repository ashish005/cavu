import {Component, Input, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder} from "@angular/forms";
import {DriverForm} from "../forms/driver.form";
import {Driver} from "../domains/driver.serializer";
import {DriverService} from "../services/driver.service";
import {DriverAPIResolver} from "../services/api.resolver";

@Component({
    templateUrl: `./templates/driver-ce.html`, standalone: false
})
export class DriverCeComponent extends DriverForm {
    public options: any;//OrgOptions;
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() set data (item: Driver) { super.populate(item); }
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public override fb: FormBuilder, public apiResolver: DriverAPIResolver, private service: DriverService) {
        super(fb);
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
