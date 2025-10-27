import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
    NotificationMediaTypeTemplate,
    NotificationPermission,
    OrgNotification
} from "../domains/notification.serializer";

export class NotificationRuleForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: [null, Validators.required],
            notificationTypeId: [null, Validators.required],
            permissions: this.fb.array([]),
            templates: this.fb.array([]),

            isEventBased: [false],
            appEvent: [null]
        });
    }

    getPermissionsFormGroup(data: NotificationPermission){
        const { id, userRoleName, userRoleId, isEnable, notificationId, status} = data;
        return this.fb.group({
            id: [id],
            userRoleName: [userRoleName],
            userRoleId: [userRoleId],
            notificationId: [notificationId],
            isEnable: [isEnable],
            status: [status]
        });
    }

    mediaTypeFormGroup(data: NotificationMediaTypeTemplate){
        const { id, name, sortOrder, mediaTypeId, hasTemplate, orgTaskScheduleId, templateId, status, isDefaultFooter, isTaskReminder } = data;
        return this.fb.group({
            id: [id],
            name: [name],
            mediaTypeId: [mediaTypeId, Validators.required],
            sortOrder: [sortOrder],
            orgTaskScheduleId: [orgTaskScheduleId],
            templateId: [templateId],
            hasTemplate: [hasTemplate],
            isDefaultFooter: [isDefaultFooter],
            isTaskReminder: [isTaskReminder],
            status: [status]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formPermissions() { return <FormArray>this.customForm.get('permissions'); }
    get formTemplates() { return <FormArray>this.customForm.get('templates'); }
    get formNotificationTypeId() { return <FormGroup>this.customForm.get('notificationTypeId'); }
    get formAppEventType() { return <FormGroup>this.customForm.get('appEvent'); }

    updateNotificationType(val){ this.formNotificationTypeId.setValue(val); }
    updateAppEventType(val){ this.formAppEventType.setValue(val); }

    addToFormRule(item: NotificationPermission){ this.formPermissions.push(this.getPermissionsFormGroup(item)); }

    addToTemplateTypeFormRule(item: NotificationMediaTypeTemplate){
        if(item.id) {
            this.formTemplates.push(this.mediaTypeFormGroup(item));
        }
    }

    populateForm(info: OrgNotification) {
        const { id, name, appEvent, notificationTypeId, isEventBased, permissions, templates } = info;
        this.customForm.get('name').setValue(name);
        this.customForm.get('appEvent').setValue(appEvent);
        this.customForm.get('notificationTypeId').setValue(notificationTypeId);
        this.customForm.get('isEventBased').setValue(isEventBased);
        this.formPermissions.controls.length = 0;
        this.formTemplates.controls.length = 0;
        (permissions || []).map((r: NotificationPermission) => { this.addToFormRule(r); });
        (templates || []).map((r: NotificationMediaTypeTemplate) => this.addToTemplateTypeFormRule(r));
    };
}