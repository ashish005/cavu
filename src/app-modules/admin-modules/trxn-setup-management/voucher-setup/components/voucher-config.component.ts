import {
    Component, Directive, EventEmitter,
    Input,
    OnInit, Output,
    TemplateRef, ViewChild
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {VoucherTypeService} from "../services/voucher-type.service";
import {ACTION_ENUM} from "@app-global";

@Directive()
export class VoucherTypeForm {
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            name: [null, Validators.required],
            isPrimary: [false],
            voucherNoDisplay: [null],
            voucherDateDisplay: [true],
            sortOrder: [false],
            isDefault: [false],
            isActive: [true],
            config: this.fb.group({
                voucherNoTypeId: [null],
                voucherNoLength: [false],
                voucherNoStartingFrom: [null],
                validFrom: [true],
                prefix: [false],
                isDefault: [false],
                startWithPrefix: [null],
                startWithZero: [null],
                suffix: [null]
            }),
            phases: this.fb.array([]),
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get formConfig() { return <FormGroup>this.customForm.get('config'); }
    get phases(): FormArray { return this.customForm.get('phases') as FormArray; }

    addPhase(data?: any): void {
        const phase = this.fb.group({
            id: [data?.id],
            name: [data?.name || ''],
            description: [data?.description || ''],
            color: [data?.color || ''],
            sortOrder: [data?.sortOrder],
            hasPhaseStatus: [data?.hasPhaseStatus || false],

            notifyToAssignee: [data?.notifyToAssignee || false],
            assignedToRoleId: [data?.assignedToRoleId],

            notifyToParty: [data?.notifyToParty],
            reportedToPartyId: [data?.reportedToPartyId],
            turnAroundTime: [data?.turnAroundTime || 24],
            skipCheckTillAmount: [data?.skipCheckTillAmount || 0],
            isActive: [data?.isActive]
        });
        this.phases.push(phase);
    }
    populateVoucherType(item: any)
    {
        this.customForm.patchValue(item);
        this.formConfig.patchValue(item.config);
        this.phases.controls.length = 0;
        (item.phases || []).map(r => this.addPhase(r));
    }
}

@Component({
    standalone: false,
    templateUrl: './templates/voucher-config.html',
    styles:[`:host { display: contents; }`]
})
export class VoucherConfigComponent extends VoucherTypeForm implements OnInit{
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    submitted: boolean = false;

    @Input() id: string;
    @Input() set data (val){ super.populateVoucherType(val); }
    get actionType() { return this.id? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
    constructor(public override fb: FormBuilder, public service: VoucherTypeService){ super(fb); }

    ngOnInit(){}
    onSubmit(row: any){
        this.submitted = true;
        const data = this.customForm.getRawValue();
        this.service.update(this.id, data).toPromise().then((resp: any) => {
            this.submitted = false;
            this.onOk.emit(true);
        }, (e)=> { this.submitted = false; });
    }
}
