import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TeamUserGroup, TeamUserGroupRule} from "../domains/user-group.serializer";

export class TeamGroupForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            categoryId: [null, Validators.required],
            userTypeId: [null, Validators.required],
            hasDynamicRules: [false],
            isActive: [false],
            rules: this.fb.array([])
        });
    }

    filterGroupForm(data: TeamUserGroupRule){
        const { id, userTypeId, userGroupId, userFilterTypeId, operator, value, valueId, isActive} = data;
        return this.fb.group(<any>{
            id: [id],
            userTypeId: [userTypeId],
            userGroupId: [userGroupId],
            userFilterTypeId: [userFilterTypeId, Validators.required],
            operator: [operator, Validators.required],
            value: [value, Validators.required],
            valueId: [valueId, Validators.required],
            isActive: [isActive],
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get formUserTypeId() { return this.customForm.get('userTypeId'); }
    get formUserGroupCategoryId() { return this.customForm.get('categoryId'); }
    updateUserTypeId(val: any){ this.formUserTypeId.setValue(val); }
    updateGroupCategoryId(val: any){ this.formUserGroupCategoryId.setValue(val); }
    get formFilterOptions() { return this.customForm.get('rules') as FormArray<FormGroup>; }
    populateUserGroup(data: TeamUserGroup){
        const { id, name, categoryId, userTypeId, hasDynamicRules, rules, isActive} = data;
        this.customForm.get('id').setValue(id);
        this.customForm.get('name').setValue(name);
        this.customForm.get('hasDynamicRules').setValue(hasDynamicRules);
        this.customForm.get('userTypeId').setValue(userTypeId, { emitEvent: false });
        this.customForm.get('categoryId').setValue(categoryId, { emitEvent: false });
        this.customForm.get('isActive').setValue(isActive);

        this.formFilterOptions.controls.length  = 0;
        (rules || [new TeamUserGroupRule(), new TeamUserGroupRule()]).map(r => {
            this.formFilterOptions.push(this.filterGroupForm(r));
        });
    }
    deleteFilterOptions(index: number){ this.formFilterOptions.removeAt(index); }
    addFilterOptions(){
        const item = new TeamUserGroupRule({ userTypeId: this.formUserTypeId.value });
        this.formFilterOptions.push(this.filterGroupForm(item));
    }
}