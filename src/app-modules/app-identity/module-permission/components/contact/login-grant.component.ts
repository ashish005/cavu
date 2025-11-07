import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContactService} from "../../services/contact.service";
import {Contact, ContactRole} from "../../domains/contact.serializer";
import {UserManagementAPIResolver} from "../../services/api.resolver";
@Directive()
class LoginGrantForm {
    userRoles: Array<any>;
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            fName: ['', Validators.required],
            lName: ['', Validators.required],
            userTypeId: ['', Validators.required],
            userMasterType: ['', Validators.required],
            email: [null],
            phone: [null],
            orgUserId: [null],
            orgBranchId: [null, Validators.required],

            status: [null],
            roles: fb.array([]),

            userName: [null],
            password: [null],
        });
    }

    getRoleFormGroup(data: ContactRole){
        const { roleId, roleName, roleMapperId, orgUserRoleId, status} = data;
        return this.fb.group({
            roleId: [roleId],
            roleName: [roleName],
            roleMapperId: [roleMapperId],
            orgUserRoleId: [orgUserRoleId],
            status: [status]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get formRoles() { return this.customForm.get('roles') as FormArray<FormGroup>; }
    addToFormRole(item: ContactRole){ this.formRoles.push(this.getRoleFormGroup(item)); }

    populateForm(item: Contact) {
        const { id, fName, lName, userTypeId, userMasterType, email, phone, orgUserId, orgBranchId, roles, status } = item;
        this.customForm.get('fName').setValue(fName);
        this.customForm.get('lName').setValue(lName);
        this.customForm.get('userTypeId').setValue(userTypeId);
        this.customForm.get('userMasterType').setValue(userMasterType);
        this.customForm.get('email').setValue(email);
        this.customForm.get('phone').setValue(phone);
        this.customForm.get('orgUserId').setValue(orgUserId);
        this.customForm.get('orgBranchId').setValue(orgBranchId);
        this.customForm.get('status').setValue(status);

        this.formRoles.controls.length = 0;

        var _roles = [];
        debugger
        (this.userRoles || []).map((r: any) => {
            const givenRole: ContactRole = (roles || []).find(e => e.orgUserRoleId == r.roleId);
            _roles.push({
                roleId: [givenRole?.roleId],
                roleName: [r.name],
                roleMapperId: [givenRole?.roleMapperId],
                orgUserRoleId: [r.id],
                status: [givenRole?.status || false]
            });
        });
        (_roles || []).map((r: ContactRole) => { this.addToFormRole(r); });
    };
}
@Component({
    standalone: false,
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
    constructor(public override fb: FormBuilder, public service: ContactService,
                private apiResolver: UserManagementAPIResolver) {
        super(fb);
        this.userRoles = apiResolver.masterType.userRoles;
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
