import {Directive, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CommunicationGateway} from "../domains/communication-gateway.serializer";

@Directive()
export class CommunicationGatewayForm implements OnInit
{
    @Input() id: any;
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    config: any = {
        editable: true,
        spellcheck: true,
        height: '15rem',
        minHeight: '3rem',
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
            id: [''],
            senderName: [''],
            senderEmailId: [''],
            emailPortNo: [''],
            mediaTypeId: [''],
            footer: [''],
            isPrimary: [false],
            isAPI: [false],
            senderAPI: [''],
            credentialId: [''],
            credentialPassword: [''],
            bccMailId: [null],
            status: [],

            mediaMasterType: [''],// for ui controlling
        });
    }

    ngOnInit(){}

    get formMediaTypeId() { return <FormGroup>this.customForm.get('mediaTypeId'); }
    get formMediaMasterType() { return <FormGroup>this.customForm.get('mediaMasterType'); }

    updateMediaTypeId(val){ this.formMediaTypeId.setValue(val); }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populateForm(item: CommunicationGateway = <CommunicationGateway>{}){
        this.id = item.id;
        this.customForm.get('id').setValue(item.id);
        this.customForm.get('senderName').setValue(item.senderName);
        this.customForm.get('mediaTypeId').setValue(item.mediaTypeId);
        this.customForm.get('mediaMasterType').setValue(item.mediaMasterType);

        this.updateMediaTypeId(item.mediaTypeId);
        this.customForm.get('senderEmailId').setValue(item.senderEmailId);
        this.customForm.get('emailPortNo').setValue(item.emailPortNo);
        this.customForm.get('senderAPI').setValue(item.senderAPI);
        this.customForm.get('credentialId').setValue(item.credentialId);
        this.customForm.get('credentialPassword').setValue(item.credentialPassword);
        this.customForm.get('footer').setValue(item.footer);
        this.customForm.get('isPrimary').setValue(item.isPrimary);
        this.customForm.get('isAPI').setValue(item.isAPI);
        this.customForm.get('bccMailId').setValue(item.bccMailId);
        this.customForm.get('status').setValue(item.status);
    }

    get isDashboard() { return (this.formMediaMasterType.value || '').toLowerCase() === 'dashboard'; }
    get isEmail() { return (this.formMediaMasterType.value || '').toLowerCase() === 'email'; }
    get isSMS() { return (this.formMediaMasterType.value || '').toLowerCase() === 'sms'; }
}