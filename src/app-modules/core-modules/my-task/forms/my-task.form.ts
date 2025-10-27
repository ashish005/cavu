import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";

@Directive()
export class MyTaskForm {
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: ['', Validators.required],
            taskTypeId: ['', Validators.required],
            orgProcessId: ['', Validators.required],

            defaultFrequencyTypeId: [''],//, Validators.required

            isManual: [true],
            isPrimary: [''],

            isVerificationRequired: [false],
            isStatusOnMailRequired: [false],
            isStatusOnMailDaily: [false],
            isStatusOnMailWeekly: [false],
            isStatusOnMailMonthly: [false],

            defaultDay: [1],
            defaultMonth: [1],

            remark: [null],
            verifiedById: [null],
            assignedToId: [null],
            reportedToId: [null],

            verifiedBy: [null],
            assignedTo: [null],
            reportedTo: [null]
        });
    }

    get formVerifiedById(){ return this.customForm.get('verifiedById'); }
    get formAssignedToId(){ return this.customForm.get('assignedToId'); }
    get formReportedToId(){ return this.customForm.get('reportedToId'); }

    get formVerifiedBy(){ return this.customForm.get('verifiedBy'); }
    get formAssignedTo(){ return this.customForm.get('assignedTo'); }
    get formReportedTo(){ return this.customForm.get('reportedTo'); }

    get formTaskTypeId() { return <FormGroup>this.customForm.get('taskTypeId'); }
    updateTaskTypeId(val){ this.formTaskTypeId.setValue(val); }

    get formOrgProcessId() { return <FormGroup>this.customForm.get('orgProcessId'); }
    updateOrgProcessId(val){ this.formOrgProcessId.setValue(val); }

    get formFrequencyTypeId() {
        return <FormGroup>this.customForm.get('defaultFrequencyTypeId');
    }

    updateFrequencyTypeId(val){
        this.formFrequencyTypeId.setValue(val);
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populateOrgTask(item: any){
        // if(!item.orgParentProcessId){
        //     item.orgParentProcessId = item.orgProcessId
        // }
        const data = Object.freeze(item);
        data.startDate = item.startDate;
        data.endDate = item.endDate;
        this.customForm.patchValue(data);
        this.formTaskTypeId.disable();
    }
}