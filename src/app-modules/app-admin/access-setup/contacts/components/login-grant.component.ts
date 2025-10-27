import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder} from "@angular/forms";
import {ContactService} from "../services/contact.service";
import {ContactAPIResolver} from "../services/api.resolver";
import {LoginGrantForm} from "../forms/login-grant.form";
import {Contact} from "../domains/contact.serializer";

@Component({
    templateUrl: './templates/login-grant.html',
    styles:[`:host { display: contents; }`]
})
export class LoginGrantComponent extends LoginGrantForm implements OnInit {
    @Input() id: string;
    @Input() orgUserId: string;
    @Input() set data(val: Contact){ super.populateForm(val)};
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    submitted: boolean;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    get actionType(){ return (this.id) ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; }
    constructor(public fb: FormBuilder, public service: ContactService, public apiResolver: ContactAPIResolver) {
        super(fb);
    }

    ngOnInit() {}

    onSubmit(_form) {
        // stop here if form is invalid
        if (_form.invalid) {
            return;
        }
        const formRaw = _form.getRawValue();

        const success = (resp: any) => {
            this.submitted = false;
            this.onOk.emit(resp);
        };
        const error = (err: any) => { this.submitted = false; this.onCancel.emit(true); };

        const failure = (err: any) => { this.submitted = false; };
        this.submitted = true;
        const onSuccess = (resp)=> {
            if(resp.isSuccess) {
                const { userId, roles} = resp.data;
                this.service.updateUserOrgId(this.id, { orgUserId: userId, roles}).subscribe(success, error);
            } else {
                this.submitted = false;
            }
        };

        this.service.grantAccessByUserId(formRaw).subscribe(onSuccess, failure);
    }
}
