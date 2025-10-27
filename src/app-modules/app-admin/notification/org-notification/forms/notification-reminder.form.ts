import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationReminder} from "../domains/reminder.serializer";
import {UserGroupLookup} from "../domains/lookup.serializer";

export class NotificationReminderForm {
    customForm: FormGroup;
    durationType: Array<any> = [{ key: 'Minutes', value: 1},{ key: 'Weeks', value: 4}, { key: 'Days', value: 3}, { key: 'Hours', value: 2}];
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
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

    updateGroupChange(row: UserGroupLookup) {
        this.formUserGroupId.setValue(row?.id);
        this.formUserGroupName.setValue(row?.name);
    }

    populateForm(data: NotificationReminder) {
        const { name, userGroupId, notificationId, orgTaskId, orgTaskScheduleId, frequencyType, reminderValue, userGroupName } = data;
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