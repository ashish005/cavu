import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {pairwise, startWith} from "rxjs";
import {TeamUserGroup} from "../domains/user-group.serializer";
import {TeamGroupForm} from "../forms/team-group.form";
import {TeamSetupAPIResolver} from "../services/api.resolver";
import {TeamSetupService, TeamUserRecordsService} from "../services/team.service";
import {TeamSetupLookup} from "../domains/lookup.serializer";

@Component({
    standalone: false,
    templateUrl: './templates/team-ce.html'
})
export class TeamCeView extends TeamGroupForm implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('ruleRecord', { static: true }) public ruleRecord;
    lookup: TeamSetupLookup;
    submitted: boolean;
    @Input() hideDynamicResult: boolean;
    @Input() set data(val) {
        this.populateUserGroup(val || new TeamUserGroup({}))
    };
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public override fb: FormBuilder, public apiResolver: TeamSetupAPIResolver,
                private userRecordsService: TeamUserRecordsService,
                protected service: TeamSetupService) {
        super(fb);
        this.lookup = apiResolver.masterType;
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
                const { hasDynamicRules } = this.lookup?.getCategoryById(next) || {};
                this.customForm.get('hasDynamicRules').setValue(hasDynamicRules || false);
            }
        };
        this.formUserTypeId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormValueChange);
        this.formUserGroupCategoryId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(categoryFormValueChange);
    }

    ngOnInit() {}

    cb(e){
       if(e.key == 'delete'){ super.deleteFilterOptions(e.index); }
    }

    searchRecord(data: FormGroup)
    {
        const formData = data.getRawValue();
        this.ruleRecord.populateRecord(formData);
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