import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Directive} from "@angular/core";
import {debounceTime, of, switchMap} from "rxjs";
import {map, Observable, startWith, Subject, takeUntil} from "rxjs";
import {pairwise} from "rxjs";
import {Contact, ContactRole} from "../domains/contact.serializer";

@Directive()
export class LoginGrantForm {
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
            orgUnitId: [null, Validators.required],
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
        const { id, fName, lName, userTypeId, userMasterType, email, phone, orgUserId, orgUnitId, orgBranchId, roles, status } = item;
        this.customForm.get('fName').setValue(fName);
        this.customForm.get('lName').setValue(lName);
        this.customForm.get('userTypeId').setValue(userTypeId);
        this.customForm.get('userMasterType').setValue(userMasterType);
        this.customForm.get('email').setValue(email);
        this.customForm.get('phone').setValue(phone);
        this.customForm.get('orgUserId').setValue(orgUserId);
        this.customForm.get('orgUnitId').setValue(orgUnitId);
        this.customForm.get('orgBranchId').setValue(orgBranchId);
        this.customForm.get('status').setValue(status);

        this.formRoles.controls.length = 0;
        (roles || []).map((r: ContactRole) => { this.addToFormRole(r); });
    };
}