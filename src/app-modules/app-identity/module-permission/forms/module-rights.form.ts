import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

export class ModuleRightsForm {
    customForm: FormGroup;
    ceRoleForm: FormGroup;
    activeUserType: any;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            roles: this.fb.array([]),
            moduleRight: this.fb.array([])
        });

        this.ceRoleForm = this.fb.group({
            name: [ null, Validators.required]
        });
    }

    createForm(data: any){
        return this.fb.group({
            id: [data.id],
            name: [data.name],
            hasRole: [data.hasRole || null]
        }) as FormGroup;
    }

    updateBaseRoles(data: Array<any>){
        this.formRoles.controls.length = 0;
        (data || []).map(r => { this.addToFormRule(r); });
    }

    updateBaseModuleRights(data: Array<any>){
        this.formModuleRight.controls.length = 0;
        (data || []).map(r => { this.addToModuleRightFormRule(r); });
    }

    getModuleRightFormGroup(data){
        data.manage = (data.view && data.create && data.modify);
        data.fullAccess = (data.manage && data.delete && data.destroy);

        const dataItem = this.fb.group({
            id: [data.id || null],
            code: [data.code || null],
            name: [data.name ||  null],
            description: [data.description ||  null],
            allowed: [data.allowed ||  true],

            fullAccess: [data.fullAccess],

            view: [data.view],
            modify: [data.modify],
            create: [data.create],

            delete: [data.delete],
            destroy: [data.destroy],

            status: [data.status],
            import: [data.import],
            export: [data.export],
            manage: [data.manage],
            modulePermission: this.fb.array([])
        });

        (data.children || []).map(r => {
            (dataItem.get('modulePermission') as FormArray<FormGroup>).push(this.getModulePermissionFormGroup(r));
        });

        return dataItem;
    }

    getModulePermissionFormGroup(data){
        data.manage = (data.view && data.create && data.modify);
        data.fullAccess = (data.manage && data.delete && data.destroy);

        return this.fb.group({
            id: [data.id || null],
            name: [data.name ||  null, Validators.required],
            code: [data.code || null, Validators.required],
            description: [data.description ||  null],
            status: [data.status],
            allowed: [data.allow ||  false],
            fullAccess: [data.fullAccess],

            view: [data.view],
            modify: [data.modify],
            create: [data.create],

            delete: [data.delete],
            destroy: [data.destroy],

            import: [data.import],
            export: [data.export],
            manage: [data.manage]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    public get formRoles() { return this.customForm.get('roles') as FormArray<FormGroup>; }
    public get formModuleRight() { return this.customForm.get('moduleRight') as FormArray<FormGroup>; }

    addToModuleRightFormRule(item){ this.formModuleRight.push(this.getModuleRightFormGroup(item)); }
    addToFormRule(item){ this.formRoles.push(this.createForm(item)); }

    getModulePermissions(rule): FormArray<FormGroup> {
        return rule.get('modulePermission') as FormArray<FormGroup>;
    }
}