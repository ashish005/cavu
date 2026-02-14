import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";

import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {OrgWorkflowPhase, OrgWorkflowPhaseStep, WorkflowNode} from "../../domains/org-workflow-node.serializer";
import {OrgWorkflowPhaseStepTask} from "../../domains/phase-step-task.serializer";
import { WorkflowPluginLookup, OrgWorkflowAPIResolver, SharedService, ASIDE_CLASS, ASIDE_SIZE } from "@app-global";
import {NotificationWizardComponent} from "../notification-wizard/notification-wizard.component";
import {OrgWorkflowPhaseStepTaskService} from "../../services/workflow.service";

@Component({
    standalone: false,
    templateUrl: './phase-step-task-editor.html',
    styles: [`:host{ display: contents; }`]
})
export class PhaseStepTaskEditorComponent implements OnInit {
    @Input() process?: WorkflowNode;
    @Input() phase?: OrgWorkflowPhase;
    @Input() step?: OrgWorkflowPhaseStep;
    @Input() task?: OrgWorkflowPhaseStepTask;

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('footerTemplate', { static: true }) public footerTemplate!: TemplateRef<any>;

    customForm: FormGroup;
    lookup: WorkflowPluginLookup;
    submitted: boolean = false;

    constructor(
        private fb: FormBuilder,
        private service: OrgWorkflowPhaseStepTaskService,
        private lookupResolver: OrgWorkflowAPIResolver,
        private sharedService: SharedService
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

        req$.subscribe({ next: success, error: error });
    }

    onNotifications() {
        if (!this.task || !this.task.id) return;

        const input = {
            context: 'task',
            process: this.process,
            phase: this.phase,
            task: this.task,
            settings: {
                triggers: {
                    onCreate: this.task.notification?.notifyOnEnter,
                    onComplete: this.task.notification?.notifyOnExit
                },
                templates: this.task.notificationTemplates || [],
                workflowEvents: this.lookup?.workflowEvents
            }
        };
        const popupHeaderOption = {
            text: `Task Notifications: ${this.task.name}`,
            desc: this.step ? this.step.name : ''
        };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        
        const success = (resp: any) => {
            if (resp && this.task && this.task.id) {
                const updatedTask = {
                    ...this.task,
                    notification: {
                        channels: [],
                        message: '',
                        ...this.task.notification,
                        notifyOnEnter: !!resp.triggers?.onCreate,
                        notifyOnExit: !!resp.triggers?.onComplete,
                    },
                    notificationTemplates: resp.templates
                };
                this.service.update(this.task.id, updatedTask).subscribe();
                Object.assign(this.task, updatedTask);
            }
            this.sharedService.destroy();
        };
        const failure = () => { this.sharedService.destroy(); };
        
        this.sharedService.showCustomPopup(NotificationWizardComponent, popupOptions, input).then(success, failure);
    }
}