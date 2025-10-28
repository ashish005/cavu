import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {Subscription} from "rxjs";
import { TaskReminderService } from "../services/task-reminder.service";
import {TaskAPIResolver, TaskByIdAPIResolver} from "../services/api.resolver";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LookupUserGroup} from "../domains/task.lookup";
import {TaskReminder} from "../domains/task-reminder.serializer";
class ReminderForm {
    customForm: FormGroup;
    durationType: Array<any> = [{ key: 'Minutes', value: 1},{ key: 'Weeks', value: 4}, { key: 'Days', value: 3}, { key: 'Hours', value: 2}];
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            id: [null],
            name: [null],
            userGroupId: [null],
            notificationId: [null],
            orgTaskId: [null],
            orgTaskScheduleId: [null],
            frequencyType: ['Hours', Validators.required],
            reminderValue: [24, Validators.required],
            userGroupName: [null]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    updateDurationType(item){ this.formReminderFrequencyType.setValue(item); }

    get formUserGroupId(){ return this.customForm.get('userGroupId'); }
    get formNotificationId(){ return this.customForm.get('notificationId'); }
    get formOrgTaskScheduleId(){ return this.customForm.get('orgTaskScheduleId'); }
    get formReminderValue(){ return this.customForm.get('reminderValue'); }
    get formReminderFrequencyType(){ return this.customForm.get('frequencyType'); }
    get formUserGroupName(){ return this.customForm.get('userGroupName'); }

    updateGroupChange(row: LookupUserGroup) {
        this.formUserGroupId.setValue(row?.id);
        this.formUserGroupName.setValue(row?.name);
    }

    populateForm(data: TaskReminder) {
        const { id, name, userGroupId, notificationId, orgTaskId, orgTaskScheduleId, frequencyType, reminderValue, userGroupName } = data;
        this.customForm.get('id').setValue(id);
        this.customForm.get('name').setValue(name);
        this.customForm.get('userGroupId').setValue(userGroupId);
        this.customForm.get('notificationId').setValue(notificationId);
        this.customForm.get('orgTaskId').setValue(orgTaskId);
        this.customForm.get('orgTaskScheduleId').setValue(orgTaskScheduleId);
        this.customForm.get('frequencyType').setValue(frequencyType || 'Hours');
        this.customForm.get('reminderValue').setValue(reminderValue || '24');
        this.customForm.get('userGroupName').setValue(userGroupName);
    };
}
@Component({
    standalone: false,
    templateUrl: './templates/reminder.html'
})
export class ReminderView extends ReminderForm implements OnInit {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    orgTaskId: number;
    pageTitle: string;
    submitted: boolean = false;
    constructor(public override fb: FormBuilder, private activatedRoute: ActivatedRoute, public lookupResolver: TaskAPIResolver,
                public service: TaskReminderService, public resolver: TaskByIdAPIResolver) {
        super(fb);
    }

    ngOnInit(){ this.orgTaskId = this.resolver.data.id; }
    get id(){ return this.customForm.get('id'); }

    onSubmit(form: FormGroup){
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        this.submitted = true;

        const performAction = (resp)=> {
            this.submitted = false;
        };

        const failure = ()=> {
            this.submitted = false;
        };

        const formValues: any = form.getRawValue();
        formValues.orgTaskId = this.orgTaskId;
        if(this.orgTaskId) {
            this.service.update(this.orgTaskId, formValues).subscribe(performAction, failure);
        } else {
            this.service.create(formValues).subscribe(performAction, failure);
        }
    }
}
