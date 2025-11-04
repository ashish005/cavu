import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import { startWith, pairwise } from "rxjs";

@Component({
    standalone: false,
    selector: 'sub-module-permission-row',
    templateUrl: './templates/sub-module-permission-row.html',
    styles: [':host { display: contents; }']
})
export class SubModulePermissionRowComponent implements OnInit {
    @Input() customForm: FormGroup;
    constructor(public fb: FormBuilder) {}
    ngOnInit(){
        const formItemChange=([prev, next]: [any, any])=>
        {
            if(prev != next)
            {
                if(next){
                    this.customForm.get('view').setValue(next,  { emitEvent: false });
                    this.customForm.get('modify').setValue(next,  { emitEvent: false });
                    this.customForm.get('create').setValue(next,  { emitEvent: false });

                    this.customForm.get('import').setValue(next,  { emitEvent: false });
                    this.customForm.get('export').setValue(next,  { emitEvent: false });

                    this.customForm.get('delete').setValue(next,  { emitEvent: false });
                    this.customForm.get('destroy').setValue(next,  { emitEvent: false });

                    this.customForm.get('manage').setValue(next,  { emitEvent: false });
                } else {
                    this.customForm.get('modify').setValue(false,  { emitEvent: false });
                    this.customForm.get('delete').setValue(false,  { emitEvent: false });
                    this.customForm.get('destroy').setValue(false,  { emitEvent: false });
                    this.customForm.get('manage').setValue(false,  { emitEvent: false });
                }
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

    changeModuleKeysPermission(isChecked: boolean, moduleKey: string, form: FormGroup)
    {
        form.get(moduleKey).setValue(isChecked,  { emitEvent: false });

        const manage = (form.get('view').value && form.get('create').value && form.get('modify').value);
        const fullAccess = (manage && form.get('delete').value && form.get('destroy').value);

        this.formModuleManageRight.setValue(manage,  { emitEvent: false });
        this.formModuleFullAccessRight.setValue(fullAccess, { emitEvent: false });
    }
}