import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Directive, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {debounceTime, of, switchMap} from "rxjs";
import {map, Observable, startWith, Subject, takeUntil} from "rxjs";
import {NotificationUser} from "@app-base/public";

@Directive()
export class TemplateCreateEditForm {
    recipientList: Array<NotificationUser> = [];
    particularsSearch = new FormControl();
    particularFocus: boolean = false;
    particular$: Array<any>;

    customForm: FormGroup;
    config: any = {
        editable: true,
        spellcheck: true,
        sanitize: true,
        //height: '30rem',
        minHeight: '15rem',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        // height: '15rem',
        // minHeight: '5rem',
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
            header: ['', Validators.required], //header
            content: ['', Validators.required],

            templateCode: [''],

            templateId: [null],
            mediaTypeId: ['', Validators.required],
            mediaMasterType: [null], // Just to know the media type

            notificationId: [null],
            notificationTypeId: [null],

            voucherId: [null],
            voucherTypeId: [null],
            voucherMasterType: [null],

            configOptions: fb.group({
                isDefaultFooter: [false],
                isBulk: [false],
                showPreview: true,
                sendPreview: false,
                includeAttachment: [false],
                //public List<IFile> Attachments { get; set; }
            }),
            recipients: fb.array([]),//this.recipientForm()
            // orgTaskScheduleId: [null],
            // isTaskReminder: [false],

            //senderId: [''],  //gatewayId
            // senderName: [''],
            // senderEmailId: [''],

            gatewayId: [null],
            senderUserId: [''],
            userTypeId: ['']
        });
        /*public form = this.fb.group({
            header: [null, [CommonValidators.nonEmpty]],
            to: [null, [Validators.required]],
            toInput: [null],
            cc: [null],
            ccInput: [null],
            bcc: [null],
            bccInput: [null],
            from: [null],
            fromInput: [null],
            replyTo: [null],
            replyToInput: [null],
            attachments: [null],
            content: [null, [Validators.required, CommonValidators.maxStringSize()]]
        });*/
    }

    recipientForm(dataItem: any = NotificationUser){
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

    get formTemplateId() { return <FormGroup>this.customForm.get('templateId'); }
    get formMediaTypeId() { return <FormGroup>this.customForm.get('mediaTypeId'); }

    get formNotificationId() { return <FormGroup>this.customForm.get('notificationId'); }
    get formNotificationTypeId() { return <FormGroup>this.customForm.get('notificationTypeId'); }

    get formVoucherId() { return <FormGroup>this.customForm.get('voucherId'); }
    get formVoucherTypeId() { return <FormGroup>this.customForm.get('voucherTypeId'); }
    get formVoucherMasterType() { return <FormGroup>this.customForm.get('voucherMasterType'); }

    get formCommGateway() { return <FormGroup>this.customForm.get('gatewayId'); }

    get formTaskName() { return <FormGroup>this.customForm.get('taskName');}
    get formProcessName() { return <FormGroup>this.customForm.get('processName');}
    get formIsDefaultFooter() { return <FormGroup>this.customForm.get('configOptions.isDefaultFooter'); }

    updateNotification(val) { this.formNotificationId.setValue(val); }
    updateMediaTypeId(val) { this.formMediaTypeId.setValue(val); }
    updateCommGateway(val) { this.formCommGateway.setValue(val); }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formRecipients(): FormArray { return <FormArray>this.customForm.get('recipients'); }
    addFormRecipients(data: NotificationUser){ this.formRecipients.push(this.recipientForm(data)); }

    populateFormRecipients(data: Array<NotificationUser>)
    {
        (data || []).map((r: NotificationUser) => this.addFormRecipients(r));
    }

    populateForm(item: any) {
        this.customForm.get('header').setValue(item.header);
        this.customForm.get('content').setValue(item.content);
        this.customForm.get('templateCode').setValue(item.templateCode);

        this.customForm.get('templateId').setValue(item.id);
        this.customForm.get('mediaTypeId').setValue(item.mediaTypeId);
        this.customForm.get('mediaMasterType').setValue(item.mediaMasterType);

        this.customForm.get('notificationId').setValue(item.notificationId);
        this.customForm.get('notificationTypeId').setValue(item.notificationTypeId);

        this.customForm.get('gatewayId').setValue(item.gatewayId);

        this.formIsDefaultFooter.setValue(<any>item.isDefaultFooter);
        // this.customForm.get('isTaskReminder').setValue(item.isTaskReminder);
        // this.customForm.get('orgTaskScheduleId').setValue(item.orgTaskScheduleId);

        // this.customForm.get('senderName').setValue(item.senderName);
        // this.customForm.get('senderEmailId').setValue(item.senderEmailId);
    };

    get formMediaType(){ return this.customForm.get('mediaMasterType'); }
    get isDashboard() { return (this.formMediaType.value || '').toLowerCase() === 'dashboard'; }
    get isEmail() { return (this.formMediaType.value || '').toLowerCase() === 'email'; }
    get isSMS() { return (this.formMediaType.value || '').toLowerCase() === 'sms'; }

    applySelect(data: NotificationUser) {
    //applySelect(data: { email: string, fName: string, lName: string, phone: string,userId: string, name: string }) {
        this.particularFocus = false;
        this.addFormRecipients(data);
        this.particularsSearch.reset();
        //this.particularsSearch.setValue(data.name, { emitEvent: false });
    }


    resetForm(){
        const { mediaTypeId, mediaMasterType } = this.customForm.getRawValue();
        this.customForm.reset();
        this.formMediaTypeId.setValue(mediaTypeId);
        this.formMediaType.setValue(mediaMasterType);
    }
}