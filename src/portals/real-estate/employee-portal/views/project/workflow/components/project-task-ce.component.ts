import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ORG_PROCESS_TYPE} from "@app-base/public";
import {ACTION_ENUM} from "@app-global";
import {ProjectWorkflowService} from "../services/project-workflow.service";
import {WorkflowPluginAPIResolver} from "../services/workflow.resolver";

@Component({
    selector: 'project-task-ce',
    templateUrl: './templates/project-task-ce.html',
    styles: [`:host{ display: contents; }`]
})
export class ProjectTaskCeComponent implements OnInit {
    @Input() id: any; //process Id
    @Input() projectId: any;
    @Input() moduleId: any;
    public get actionType(){
        return this.id ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD;
    };
    submitted: boolean = false;

    processList: Array<any>;

    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public fb: FormBuilder, public service: ProjectWorkflowService, public apiResolver: WorkflowPluginAPIResolver) {
        this.customForm = fb.group({
            name: ['', Validators.required],
            taskTypeId: ['', Validators.required],
            processId: ['', Validators.required],  //Project Process Id
            orgProcessId: [''],

            defaultFrequencyTypeId: ['', Validators.required],

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

            verifiedByName: [null],
            assignedToName: [null],
            reportedToName: [null]
        });
    }
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    get formVerifiedById(){ return this.customForm.get('verifiedById'); }
    get formAssignedToId(){ return this.customForm.get('assignedToId'); }
    get formReportedToId(){ return this.customForm.get('reportedToId'); }

    get formVerifiedBy(){ return this.customForm.get('verifiedByName'); }
    get formAssignedTo(){ return this.customForm.get('assignedToName'); }
    get formReportedTo(){ return this.customForm.get('reportedToName'); }

    get formTaskTypeId() {
        return <FormGroup>this.customForm.get('taskTypeId');
    }

    updateTaskTypeId(val){
        this.formTaskTypeId.setValue(val);
    }

    get formOrgProcessId() {
        return <FormGroup>this.customForm.get('orgProcessId');
    }

    updateOrgProcessId(val){
        this.formOrgProcessId.setValue(val);
    }

    get formOrgParentProcessId() {
        return <FormGroup>this.customForm.get('orgParentProcessId');
    }

    updateOrgParentProcessId(val){
        this.formOrgParentProcessId.setValue(val);
    }

    get formFrequencyTypeId() {
        return <FormGroup>this.customForm.get('defaultFrequencyTypeId');
    }

    updateFrequencyTypeId(val){
        this.formFrequencyTypeId.setValue(val);
    }

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

    populateOrgTask(item: any){
        // if(!item.orgParentProcessId){
        //     item.orgParentProcessId = item.orgProcessId
        // }
        this.customForm.patchValue(item);
    }

    ngOnInit(){
        this.processList = this.apiResolver?.masterType?.getAllOrgProcessByRootProcessMaster(ORG_PROCESS_TYPE.PROJECT_MANAGEMENT);
        this.formTaskTypeId.disable();
    }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) { return; }
        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit({ refresh: true });
        };
        const error = (resp)=> { this.submitted = false; };

        this.submitted = true;
        if(this.id) {
            this.service.updateOrgTask(this.id, form.value).subscribe(success, error);
        } else {
            this.service.createProjectTask(form.value).subscribe(success, error);
        }
    }
}
