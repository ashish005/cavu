import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Directive, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {map, Observable, startWith, Subject, takeUntil} from "rxjs";
import {pairwise} from "rxjs";
import {NotificationTemplate} from "../domains/notification-template.serializer";

@Directive()
export class TemplateForm {
    customForm: FormGroup;
    config: any = {
        editable: true,
        spellcheck: true,
        sanitize: true,
        height: '15rem',
        minHeight: '5rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        toolbarHiddenButtons: [
            ['bold']
        ],
        customClasses: [
            {
                name: "quote",
                class: "quote",
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: "titleText",
                class: "titleText",
                tag: "h1",
            },
        ]
    };

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            header: ['', Validators.required], //header
            content: ['', Validators.required],

            mediaTypeId: ['', Validators.required],

            templateCode: [''],

            isDefaultFooter: [false],
            isTaskReminder: [false],
            gatewayId: [null],
            notificationId: [null, Validators.required],
            orgTaskScheduleId: [null],

            mediaMasterType: [null, Validators.required], // Just to know the media type
            recipients: fb.array([]),//this.recipientForm()

            // isShowPreview: true,
            // isSendPreview: false
            status: [null],
        });

        this.formMediaType.valueChanges
            .pipe(startWith(null as string), pairwise())
            .subscribe(([prev, next]: [any, any]) =>
            {
                if(prev != next)
                {
                    if(this.isSMS){ this.customForm.get('header').clearValidators(); }
                    else { this.customForm.get('header').setValidators([Validators.required]); }
                }
            });
    }

    recipientForm(dataItem: any){
        const items = this.fb.group({
            email: [dataItem.email],
            mobile: [dataItem.mobile],
            userId: [dataItem.userId],
            name: [dataItem.name],
            header: [dataItem.header],
            content: [dataItem.content],
            scheduleDeliveryTime: [dataItem.scheduleDeliveryTime],
            isSuccess: [dataItem.isSuccess],
        });
        return items;
    }

    get formId() { return <FormGroup>this.customForm.get('id'); }
    get formMediaTypeId() { return <FormGroup>this.customForm.get('mediaTypeId'); }
    get formGatewayId() { return <FormGroup>this.customForm.get('gatewayId'); }
    get formNotificationId() { return <FormGroup>this.customForm.get('notificationId'); }
    get formOrgTaskScheduleId() { return <FormGroup>this.customForm.get('orgTaskScheduleId'); }

    updateMediaTypeId(val) { this.formMediaTypeId.setValue(val); }
    updateCommGatewayId(val) { this.formGatewayId.setValue(val); }
    updateNotification(val) { this.formNotificationId.setValue(val); }
    updateOrgTaskScheduleId(val) { this.formOrgTaskScheduleId.setValue(val); }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formRecipients(): FormArray { return <FormArray>this.customForm.get('recipients'); }
    addFormRecipients(data: any){ this.formRecipients.push(this.recipientForm(data)); }

    populateFormRecipients(data: Array<any>) {
        //(data || []).map((r: NotificationUser) => this.addFormRecipients(r));
    }

    populateForm(item: NotificationTemplate) {
        const {
            id, header, templateCode, content, isDefaultFooter, isTaskReminder, orgTaskScheduleId,
            mediaTypeId, notificationId, gatewayId, status
        } = item;
        this.customForm.get('id').setValue(id);
        this.customForm.get('header').setValue(header);
        this.customForm.get('templateCode').setValue(templateCode);

        this.customForm.get('content').setValue(content);

        this.customForm.get('isDefaultFooter').setValue(isDefaultFooter);
        this.customForm.get('isTaskReminder').setValue(isTaskReminder);

        this.customForm.get('gatewayId').setValue(gatewayId);
        this.customForm.get('notificationId').setValue(notificationId);
        this.customForm.get('orgTaskScheduleId').setValue(orgTaskScheduleId);
        this.customForm.get('mediaTypeId').setValue(mediaTypeId);
        this.customForm.get('status').setValue(status);
    };

    get formMediaType(){ return this.customForm.get('mediaMasterType'); }
    get isDashboard() { return (this.formMediaType.value || '').toLowerCase() === 'dashboard'; }
    get isEmail() { return (this.formMediaType.value || '').toLowerCase() === 'email'; }
    get isSMS() { return (this.formMediaType.value || '').toLowerCase() === 'sms'; }

    resetForm(){
        const { mediaTypeId, mediaMasterType } = this.customForm.getRawValue();
        this.customForm.reset();
        this.formMediaTypeId.setValue(mediaTypeId);
        this.formMediaType.setValue(mediaMasterType);
    }
}