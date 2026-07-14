import {Component, Input, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder} from "@angular/forms";
import {ClientEmployeeForm} from "../forms/client-employee.form";
import {ClientAPIResolver, ClientContactService} from "../services";
import {Contact} from "../domains/contact.serializer";

@Component({
  standalone: false,
  templateUrl: `./templates/client-member-ce.html`
})
export class ClientMemberCEComponent extends ClientEmployeeForm {
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() set data(item: Contact) {
        super.populateClientContacts(item);
    };
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public override fb: FormBuilder, public apiResolver: ClientAPIResolver, private service: ClientContactService) {
        super(fb);
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
        const data = form.getRawValue();
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, data).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(data).subscribe(success, error);
        }
    }
}
