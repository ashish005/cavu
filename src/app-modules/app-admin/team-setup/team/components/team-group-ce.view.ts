import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {pairwise, startWith} from "rxjs";
import {TeamUserGroup} from "../domains/user-group.serializer";
import {TeamGroupForm} from "../forms/team-group.form";
import {TeamSetupAPIResolver} from "../services/api.resolver";
import {TeamSetupService} from "../services/team.service";

@Component({ selector: 'group-ce', templateUrl: './templates/team-group-ce.html', styles: [':host { display: contents; }'] })
export class TeamGroupCeView extends TeamGroupForm implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;

    pageTitle: string;
    userList: Array<any>;
    submitted: boolean;
    @Input() hideDynamicResult: boolean;
    @Input() set data(val) {
        this.populateUserGroup(val || new TeamUserGroup({}))
    };
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public fb: FormBuilder, private router: Router,
                public apiResolver: TeamSetupAPIResolver,
                protected service: TeamSetupService, private activatedRoute: ActivatedRoute)
    {
        super(fb);
        const { data, parent} = this.activatedRoute.snapshot;
        this.pageTitle = data.title || parent?.data?.title;
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
    }

    ngOnInit() {}

    userGroupCallback(data)
    {
        super.populateUserGroup(data);
    }

    searchRecord(data)
    {
        const success = (resp)=> { this.userList = resp.entities; };
        const error = (resp)=> {};
        this.apiResolver.getUserFilteredRecords(data.getRawValue()).subscribe(success, error);
    }

    cb(e){
       if(e.key == 'delete'){
           super.deleteFilterOptions(e.index);
       }
    }

    onSubmit(form: FormGroup) {
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

        const formData = form.getRawValue();
        this.submitted = true;

        if(formData.id) {
            this.service.update(formData.id, formData).subscribe(success, error);
        } else {
            this.service.create(formData).subscribe(success, error);
        }
    }
}