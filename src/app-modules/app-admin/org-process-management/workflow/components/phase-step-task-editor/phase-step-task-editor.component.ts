import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PhaseStepTaskService} from "../phase-step-task/phase-step-task.component";

import {Phase, PhaseStep, WorkflowNode} from "../../domains/org-workflow-node.serializer";
import {PhaseStepTask} from "../../domains/phase-step-task.serializer";
import { WorkflowPluginLookup, OrgWorkflowAPIResolver } from "@app-global";

@Component({
    standalone: false,
    templateUrl: './phase-step-task-editor.html',
    styles: [`:host{ display: contents; }`]
})
export class PhaseStepTaskEditorComponent implements OnInit {
    @Input() process?: WorkflowNode;
    @Input() phase?: Phase;
    @Input() step?: PhaseStep;
    @Input() task?: PhaseStepTask;

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('footerTemplate', { static: true }) public footerTemplate!: TemplateRef<any>;

    customForm: FormGroup;
    lookup: WorkflowPluginLookup;
    submitted: boolean = false;

    constructor(
        private fb: FormBuilder,
        private service: PhaseStepTaskService,
        private lookupResolver: OrgWorkflowAPIResolver
    ) {
        this.lookup = this.lookupResolver.masterType;
        this.customForm = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            remark: [null],
            phaseStepId: [null, Validators.required],
            taskPriorityId: [null, Validators.required],
            frequencyTypeId: [null, Validators.required],
            isManual: [true],
            isPrimary: [false],
            isVerificationRequired: [false],
            isStatusOnMailRequired: [false],
            isActive: [true]
        });
    }

    get f() { return this.customForm.controls; }

    ngOnInit(): void {
        const frequency = this.lookup?.defaultFrequency();
        const priority = this.lookup?.defaultTaskPriority();

        if (this.task && this.task.id) {
            this.customForm.patchValue({
                id: this.task.id,
                name: this.task.name,
                remark: this.task.remark,
                phaseStepId: this.task.phaseStepId,
                taskPriorityId: this.task.taskPriorityId,
                frequencyTypeId: this.task.frequencyTypeId,
                isManual: this.task.isManual,
                isPrimary: this.task.isPrimary,
                isVerificationRequired: this.task.isVerificationRequired,
                isStatusOnMailRequired: this.task.isStatusOnMailRequired,
                isActive: this.task.isActive
            });
        } else {
            this.customForm.patchValue({
                phaseStepId: this.step?.id || null,
                taskPriorityId: priority?.id || null,
                frequencyTypeId: frequency?.id || null,
                isManual: true,
                isPrimary: false,
                isVerificationRequired: false,
                isStatusOnMailRequired: false,
                isActive: true
            });
        }
    }

    onSubmit(form: FormGroup) {
        if (form.invalid) {
            return;
        }

        const payload = form.getRawValue();
        this.submitted = true;

        const isUpdate = !!payload.id;
        const req$ = isUpdate
            ? this.service.update(payload.id, payload)
            : this.service.create(payload);

        const success = (resp: any) => {
            this.submitted = false;
            this.onOk.emit(resp);
        };

        const error = () => {
            this.submitted = false;
        }

        req$.subscribe(success, error);
    }
}