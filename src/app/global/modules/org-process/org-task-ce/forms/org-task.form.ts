import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";
import {OrgTask} from "../domains/org-task.serializer";
import {DAYS, MONTHS} from "@app-base/enums";

@Directive()
export class OrgTaskForm {
    months: Array<any> = MONTHS;
    days: Array<any> = DAYS;
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: ['', Validators.required],
            remark: [null],
            taskTypeId: [null],
            orgProcessId: [null, Validators.required],
            taskPriorityId: [null, Validators.required],

            isManual: [true],
            isPrimary: [false],

            isVerificationRequired: [false],
            isStatusOnMailRequired: [false],
            isStatusOnMailDaily: [false],
            isStatusOnMailWeekly: [false],
            isStatusOnMailMonthly: [false],

            defaultFrequencyTypeId: [null, Validators.required],
            defaultDay: [1],
            defaultMonth: [1],

            verifiedById: [null],
            assignedToId: [null],
            reportedToId: [null],

            verifiedByName: [null],
            assignedToName: [null],
            reportedToName: [null]
        });
    }

    get formVerifiedById(){ return this.customForm.get('verifiedById'); }
    get formAssignedToId(){ return this.customForm.get('assignedToId'); }
    get formReportedToId(){ return this.customForm.get('reportedToId'); }

    get formVerifiedBy(){ return this.customForm.get('verifiedByName'); }
    get formAssignedTo(){ return this.customForm.get('assignedToName'); }
    get formReportedTo(){ return this.customForm.get('reportedToName'); }

    get formTaskPriorityId() { return <FormGroup>this.customForm.get('taskPriorityId'); }
    updateTaskPriorityId(val){ this.formTaskPriorityId.setValue(val); }

    get formOrgProcessId() { return <FormGroup>this.customForm.get('orgProcessId'); }
    updateOrgProcessId(val){ this.formOrgProcessId.setValue(val); }

    get formFrequencyTypeId() { return <FormGroup>this.customForm.get('defaultFrequencyTypeId'); }
    updateFrequencyTypeId(val){ this.formFrequencyTypeId.setValue(val); }

    updateVerifiedById(val: any){
        const { id, orgUserId, userId, name} = val || {};
        this.formVerifiedById.setValue(userId, { emitEvent: false});
        this.formVerifiedBy.setValue(name, { emitEvent: false});
    }
    updateAssignedToId(val){
        const { id, orgUserId, userId, name} = val || {};
        this.formAssignedToId.setValue(userId, { emitEvent: false});
        this.formAssignedTo.setValue(name, { emitEvent: false});
    }
    updateReportedToId(val){
        const { id, orgUserId, userId, name} = val || {};
        this.formReportedToId.setValue(userId, { emitEvent: false});
        this.formReportedTo.setValue(name, { emitEvent: false});
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populateOrgTask(item: OrgTask){
        // if(!item.orgParentProcessId){
        //     item.orgParentProcessId = item.orgProcessId
        // }
        this.customForm.patchValue(item);
    }
}