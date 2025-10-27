import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {TeamUserGroup, TeamUserGroupQueryOptions} from "../domains/user-group.serializer";
import {TeamSetupService} from "../services/team.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TeamGroupForm} from "../forms/team-group.form";
import {TeamSetupAPIResolver} from "../services";
import { pairwise, startWith, Subscription } from "rxjs";

@Component({ templateUrl: './templates/rule-setup.html' })
export class RulesSetupComponent extends TeamGroupForm implements OnInit, OnDestroy {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    submitted: boolean;
    subscription: Subscription;
    constructor(public fb: FormBuilder,
                public apiResolver: TeamSetupAPIResolver,
                protected service: TeamSetupService)
    {
        super(fb);
        const itemFormValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                this.formFilterOptions.controls.length = 0;
            }
        };
        const categoryFormValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                const { hasDynamicRules } = this.apiResolver.masterType?.getCategoryById(next) || {};
                this.customForm.get('hasDynamicRules').setValue(hasDynamicRules || false);
            }
        };
        this.formUserTypeId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormValueChange);
        this.formUserGroupCategoryId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(categoryFormValueChange);

        this.subscription = this.service.teamChangeEvent.subscribe((val) => {
            if(val) {
                this.populateUserGroup(val || new TeamUserGroup({}))
            }
        });
    }

    ngOnInit() {

    }

    ngOnDestroy(){ this.subscription?.unsubscribe(); }

    userGroupCallback(data) { super.populateUserGroup(data); }

    cb(e){
        if(e.key == 'delete'){
            super.deleteFilterOptions(e.index);
        }
    }

    onSubmit(form: FormGroup) {
        // stop here if form is invalid
        if (form.invalid) { return; }

        const success = (resp)=> { this.submitted = false; };
        const error = (resp)=> { this.submitted = false; };

        const formData = form.getRawValue();
        this.submitted = true;

        if(formData.id) {
            this.service.update(formData.id, formData).subscribe(success, error);
        } else {
            this.service.create(formData).subscribe(success, error);
        }
    }
}