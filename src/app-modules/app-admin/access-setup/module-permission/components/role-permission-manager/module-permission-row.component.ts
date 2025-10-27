import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import { startWith, pairwise } from "rxjs";

@Component({
    selector: 'module-permission-row',
    templateUrl: './templates/module-permission-row.html',
    styles: [':host { display: contents; }']
})
export class ModulePermissionRowComponent implements OnInit {
    @Input() customForm: FormGroup;
    constructor(public fb: FormBuilder) {}
    ngOnInit(){
        const formItemChange=([prev, next]: [any, any])=>
        {
            if(prev != next)
            {
                this.changeModulePermission(next, this.customForm);
            }
        };
        this.customForm.get('fullAccess').valueChanges.pipe(startWith(null as string), pairwise()).subscribe(formItemChange);
        this.customForm.get('view').valueChanges
            .pipe(startWith(null as string), pairwise())
            .subscribe(([prev, next]: [any, any])=> { this.changeModuleKeysPermission(next, 'view', this.customForm); });

        this.customForm.get('modify').valueChanges
            .pipe(startWith(null as string), pairwise())
            .subscribe(([prev, next]: [any, any])=> { this.changeModuleKeysPermission(next, 'modify', this.customForm); });

        this.customForm.get('create').valueChanges
            .pipe(startWith(null as string), pairwise())
            .subscribe(([prev, next]: [any, any])=> { this.changeModuleKeysPermission(next, 'create', this.customForm); });

        this.customForm.get('delete').valueChanges
            .pipe(startWith(null as string), pairwise())
            .subscribe(([prev, next]: [any, any])=> { this.changeModuleKeysPermission(next, 'delete', this.customForm); });

        this.customForm.get('destroy').valueChanges
            .pipe(startWith(null as string), pairwise())
            .subscribe(([prev, next]: [any, any])=> { this.changeModuleKeysPermission(next, 'destroy', this.customForm); });

        this.customForm.get('manage').valueChanges
            .pipe(startWith(null as string), pairwise())
            .subscribe(([prev, next]: [any, any])=> { this.changeModuleKeysPermission(next, 'manage', this.customForm); });
    }

    get formModuleManageRight() { return this.customForm.get('manage'); }
    get formModuleFullAccessRight() { return this.customForm.get('fullAccess'); }
    get formModulePermissions() { return <FormArray>this.customForm.get('modulePermission'); }

    public allowedChanges(isChecked: boolean, form: FormGroup) {
        if(isChecked) { form.get('modulePermission').enable(); }
        else { form.get('modulePermission').disable(); }
        this.changeModulePermission(isChecked, form);
    }

    changeModulePermission(isChecked: boolean, form: FormGroup)
    {
        form.get('view').setValue(isChecked,  { emitEvent: false });
        form.get('modify').setValue(isChecked,  { emitEvent: false });
        form.get('create').setValue(isChecked,  { emitEvent: false });
        form.get('delete').setValue(isChecked,  { emitEvent: false });
        form.get('destroy').setValue(isChecked,  { emitEvent: false });
        form.get('import').setValue(isChecked,  { emitEvent: false });
        form.get('export').setValue(isChecked,  { emitEvent: false });
        form.get('manage').setValue(isChecked,  { emitEvent: false });

        (this.formModulePermissions.controls || []).map((r: FormGroup) => {
            r.get('fullAccess').setValue(isChecked,  { emitEvent: false });
            r.get('view').setValue(isChecked,  { emitEvent: false });
            r.get('modify').setValue(isChecked,  { emitEvent: false });
            r.get('create').setValue(isChecked,  { emitEvent: false });
            r.get('delete').setValue(isChecked,  { emitEvent: false });
            r.get('destroy').setValue(isChecked,  { emitEvent: false });
            r.get('import').setValue(isChecked,  { emitEvent: false });
            r.get('export').setValue(isChecked,  { emitEvent: false });
            r.get('manage').setValue(isChecked,  { emitEvent: false });
        });
    }

    changeModuleKeysPermission(isChecked: boolean, moduleKey: string, form: FormGroup)
    {
        form.get(moduleKey).setValue(isChecked,  { emitEvent: false });

        this.syncFullAccess(form);
        (this.formModulePermissions.controls || []).map((r: FormGroup) => {
            r.get(moduleKey).setValue(isChecked,  { emitEvent: false });
            this.syncFullAccess(r);
        });
    }

    syncFullAccess(form){
        const manage = (form.get('view').value && form.get('create').value && form.get('modify').value);
        const fullAccess = (manage && form.get('delete').value && form.get('destroy').value);

        form.get('manage').setValue(manage,  { emitEvent: false });
        form.get('fullAccess').setValue(fullAccess,  { emitEvent: false });
    }
}