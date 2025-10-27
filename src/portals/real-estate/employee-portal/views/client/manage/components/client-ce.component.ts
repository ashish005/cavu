import {Component, Directive, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientService, ClientAPIResolver} from "../services";
import {Client} from "../domains/client.serializer";

@Directive()
class ClientForm {
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            title: [null],
            fName: ['', Validators.required],
            lName: [''],
            nickName: [''],

            dob: [''],
            genderId: [''],
            maritalStatusId: [],
            bloodGroupId: [''],
            nationalityId: [''],

            address: [''],
            pincode: [''],

            phone: [''],
            email: [''],

            isRegistered: [false],
            registrationNo: [null],
            registrationDate: [null],
            companyName: [''],
            taxRegistrationNo: ['']
        });
    }

    get formGenderId() { return <FormGroup>this.customForm.get('genderId'); }
    get formMaritalStatusId() { return <FormGroup>this.customForm.get('maritalStatusId'); }
    get formBloodGroupId() { return <FormGroup>this.customForm.get('bloodGroupId'); }
    get formNationalityId() { return <FormGroup>this.customForm.get('nationalityId'); }

    updateGender(val){ this.formGenderId.setValue(val); }
    updateMaritalStatus(val){ this.formMaritalStatusId.setValue(val); }
    updateBloodGroup(val){ this.formBloodGroupId.setValue(val); }
    updateNationality(val){ this.formNationalityId.setValue(val); }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populateClient(item: Client){
        const {
            id, title, fName, lName, nickName, name, dob, genderId, maritalStatusId, bloodGroupId, nationalityId,
            isRegistered, registrationNo, registrationDate, companyName, taxRegistrationNo,
            phone, email,
            address, pincode
        } = item || <Client>{};

        this.customForm.get('id').setValue(id);
        this.customForm.get('title').setValue(title);
        this.customForm.get('fName').setValue(fName);
        this.customForm.get('lName').setValue(lName);
        this.customForm.get('nickName').setValue(nickName);

        this.customForm.get('dob').setValue(dob);
        this.customForm.get('genderId').setValue(genderId, { emitEvent: false });
        this.customForm.get('maritalStatusId').setValue(maritalStatusId, { emitEvent: false });
        this.customForm.get('bloodGroupId').setValue(bloodGroupId, { emitEvent: false });
        this.customForm.get('nationalityId').setValue(nationalityId, { emitEvent: false });

        this.customForm.get('address').setValue(address);
        this.customForm.get('pincode').setValue(pincode);

        this.customForm.get('phone').setValue(phone);
        this.customForm.get('email').setValue(email);

        this.customForm.get('isRegistered').setValue(isRegistered);
        this.customForm.get('registrationNo').setValue(registrationNo);
        this.customForm.get('registrationDate').setValue(registrationDate);
        this.customForm.get('companyName').setValue(companyName);
        this.customForm.get('taxRegistrationNo').setValue(taxRegistrationNo);
    }
}

@Component({
  standalone: false,
    templateUrl: `./templates/client-ce.html`,
    styles: [`:host { display: contents;}`]
})
export class ClientCEComponent extends ClientForm {
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() set data(item: Client) {
        super.populateClient(item);
    };
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public override fb: FormBuilder, public apiResolver: ClientAPIResolver, private service: ClientService) {
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
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, form.value).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(form.value).subscribe(success, error);
        }
    }
}
