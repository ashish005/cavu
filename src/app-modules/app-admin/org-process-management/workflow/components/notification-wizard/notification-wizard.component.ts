import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Phase, PhaseStep, WorkflowNode} from "../../domains/org-workflow-node.serializer";
import {PhaseStepTask} from "../../domains/phase-step-task.serializer";

export type NotificationContext = 'process' | 'phase' | 'task';

@Component({
    selector: 'notification-wizard',
    standalone: false,
    templateUrl: './notification-wizard.html',
    styles: [`
        .wizard-nav { width: 200px; border-right: 1px solid rgba(120, 130, 140, 0.13); }
        .wizard-content { flex: 1; }
        .nav-link { cursor: pointer; border-radius: 0; border-left: 3px solid transparent; color: inherit; }
        .nav-link.active { border-left-color: #0cc2aa; background: rgba(120, 130, 140, 0.05); font-weight: 500; }
        .nav-link:hover { background: rgba(120, 130, 140, 0.05); }
    `]
})
export class NotificationWizardComponent implements OnInit {
    @ViewChild('footerTemplate', { static: true }) footerTemplate!: TemplateRef<any>;

    @Input() context: NotificationContext = 'phase';
    @Input() process?: WorkflowNode;
    @Input() phase?: Phase;
    @Input() task?: PhaseStepTask;
    
    // Initial settings
    @Input() settings: any = {};

    onOk!: (payload?: any) => void;
    onCancel!: () => void;

    @Input() activeStep: 'triggers' | 'templates' = 'triggers';
    
    // Triggers
    triggers: any = {};
    availableTriggers: any[] = [];

    // Templates
    templates: any[] = [];
    editingTemplate: any = null;
    editingTemplateIndex: number = -1;

    availableChannels = [
        { id: 'EMAIL', name: 'Email' },
        { id: 'SMS', name: 'SMS' },
        { id: 'INAPP', name: 'In-App' }
    ];

    constructor() {}

    ngOnInit() {
        this.initTriggers();
        this.initTemplates();
    }

    get contextTitle(): string {
        switch(this.context) {
            case 'process': return this.process?.name || 'Process';
            case 'phase': return this.phase?.name || 'Phase';
            case 'task': return this.task?.name || 'Task';
            default: return '';
        }
    }

    initTriggers() {
        // Load existing triggers from settings
        this.triggers = { ...this.settings.triggers };

        // Define available triggers based on context
        switch(this.context) {
            case 'process':
                this.availableTriggers = [
                    { key: 'onStart', label: 'Process Started', desc: 'When the process is initiated' },
                    { key: 'onComplete', label: 'Process Completed', desc: 'When the process finishes successfully' },
                    { key: 'onCancel', label: 'Process Cancelled', desc: 'When the process is cancelled' }
                ];
                break;
            case 'phase':
                this.availableTriggers = [
                    { key: 'onEnter', label: 'Phase Started', desc: 'When the workflow enters this phase' },
                    { key: 'onExit', label: 'Phase Completed', desc: 'When the workflow exits this phase' },
                    { key: 'onSlaBreach', label: 'SLA Breach', desc: 'When the phase exceeds its SLA' }
                ];
                break;
            case 'task':
                this.availableTriggers = [
                    { key: 'onCreate', label: 'Task Created', desc: 'When the task is generated' },
                    { key: 'onAssign', label: 'Task Assigned', desc: 'When the task is assigned to a user' },
                    { key: 'onComplete', label: 'Task Completed', desc: 'When the task is marked as done' },
                    { key: 'onOverdue', label: 'Task Overdue', desc: 'When the task passes its due date' }
                ];
                break;
        }
    }

    initTemplates() {
        this.templates = (this.settings.templates || []).map((t: any) => ({ ...t }));
    }

    // --- Template Management ---

    addTemplate() {
        this.editingTemplate = {
            name: 'New Template',
            channel: 'EMAIL',
            subject: '',
            body: '',
            isActive: true
        };
        this.editingTemplateIndex = -1;
        this.activeStep = 'templates';
    }

    editTemplate(index: number) {
        this.editingTemplate = { ...this.templates[index] };
        this.editingTemplateIndex = index;
    }

    saveTemplate() {
        if (!this.editingTemplate) return;

        if (!this.editingTemplate.name || !this.editingTemplate.channel) {
            return;
        }

        if (this.editingTemplateIndex > -1) {
            this.templates[this.editingTemplateIndex] = this.editingTemplate;
        } else {
            this.templates.push(this.editingTemplate);
        }
        this.editingTemplate = null;
        this.editingTemplateIndex = -1;
    }

    cancelEditTemplate() {
        this.editingTemplate = null;
        this.editingTemplateIndex = -1;
    }

    removeTemplate(index: number) {
        this.templates.splice(index, 1);
        if (this.editingTemplateIndex === index) {
            this.cancelEditTemplate();
        }
    }

    // --- Final Save ---

    save() {
        const payload = {
            context: this.context,
            id: this.getEntityId(),
            triggers: this.triggers,
            templates: this.templates
        };
        
        if (this.onOk) {
            this.onOk(payload);
        }
    }

    getEntityId() {
        switch(this.context) {
            case 'process': return this.process?.id;
            case 'phase': return this.phase?.id;
            case 'task': return this.task?.id;
            default: return null;
        }
    }
}
