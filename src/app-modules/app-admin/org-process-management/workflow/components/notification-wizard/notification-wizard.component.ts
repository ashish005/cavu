import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Phase, PhaseStep, WorkflowNode} from "../../domains/org-workflow-node.serializer";
import {PhaseStepTask} from "../../domains/phase-step-task.serializer";

export type NotificationContext = 'process' | 'phase' | 'task' | 'step';

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
    @Input() step?: PhaseStep;
    @Input() task?: PhaseStepTask;
    
    // Initial settings
    @Input() settings: any = {};

    onOk!: (payload?: any) => void;
    onCancel!: () => void;

    // UI State
    selectedTriggerKey: string | null = null;
    
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
        
        // Select first trigger by default
        if (this.availableTriggers.length > 0) {
            this.selectedTriggerKey = this.availableTriggers[0].key;
        }
    }

    get contextTitle(): string {
        switch(this.context) {
            case 'process': return this.process?.name || 'Process';
            case 'phase': return this.phase?.name || 'Phase';
            case 'step': return this.step?.name || 'Step';
            case 'task': return this.task?.name || 'Task';
            default: return '';
        }
    }

    get currentTemplates() {
        if (!this.selectedTriggerKey) return [];
        return this.templates.filter(t => t.trigger === this.selectedTriggerKey);
    }

    get selectedTrigger() {
        return this.availableTriggers.find(t => t.key === this.selectedTriggerKey);
    }

    initTriggers() {
        // Load existing triggers from settings
        this.triggers = { ...this.settings.triggers };

        // Check if workflowEvents are provided in settings
        if (this.settings.workflowEvents && this.settings.workflowEvents[this.context]) {
             this.availableTriggers = this.settings.workflowEvents[this.context];
             return;
        }

        // Define available triggers based on context
        switch(this.context) {
            case 'process':
                this.availableTriggers = [
                    { key: 'onStart', label: 'Process Started', desc: 'When the process is initiated' },
                    { key: 'onComplete', label: 'Process Completed', desc: 'When the process finishes successfully' },
                    { key: 'onCancel', label: 'Process Cancelled', desc: 'When the process is cancelled' },
                    { key: 'onReminderBeforeDue', label: 'Reminder: Before Due Date', desc: 'Scheduled reminder before the process due date' },
                    { key: 'onReminderOverdue', label: 'Reminder: Overdue', desc: 'Scheduled reminder when the process is overdue' },
                    { key: 'onReminderAfterStart', label: 'Reminder: After Start', desc: 'Scheduled reminder after process starts (if not completed)' }
                ];
                break;
            case 'phase':
                this.availableTriggers = [
                    { key: 'onEnter', label: 'Phase Started', desc: 'When the workflow enters this phase' },
                    { key: 'onExit', label: 'Phase Completed', desc: 'When the workflow exits this phase' },
                    { key: 'onSlaBreach', label: 'SLA Breach', desc: 'When the phase exceeds its SLA' },
                    { key: 'onReminderBeforeSla', label: 'Reminder: Before SLA Breach', desc: 'Scheduled reminder before SLA breach' },
                    { key: 'onReminderAfterStart', label: 'Reminder: After Start', desc: 'Scheduled reminder after phase starts (if not completed)' }
                ];
                break;
            case 'step':
                this.availableTriggers = [
                    { key: 'onEnter', label: 'Step Started', desc: 'When the step is activated' },
                    { key: 'onExit', label: 'Step Completed', desc: 'When the step is completed' },
                    { key: 'onReminderBeforeSla', label: 'Reminder: Before SLA Breach', desc: 'Scheduled reminder before SLA breach' },
                    { key: 'onReminderAfterStart', label: 'Reminder: After Start', desc: 'Scheduled reminder after step starts (if not completed)' }
                ];
                break;
            case 'task':
                this.availableTriggers = [
                    { key: 'onCreate', label: 'Task Created', desc: 'When the task is generated' },
                    { key: 'onAssign', label: 'Task Assigned', desc: 'When the task is assigned to a user' },
                    { key: 'onComplete', label: 'Task Completed', desc: 'When the task is marked as done' },
                    { key: 'onOverdue', label: 'Task Overdue', desc: 'When the task passes its due date' },
                    { key: 'onReminderBeforeDue', label: 'Reminder: Before Due Date', desc: 'Scheduled reminder before task due date' },
                    { key: 'onReminderOverdue', label: 'Reminder: Overdue', desc: 'Scheduled reminder when the task is overdue' }
                ];
                break;
        }
    }

    initTemplates() {
        this.templates = (this.settings.templates || []).map((t: any) => ({ ...t }));
    }

    // --- Template Management ---

    addTemplate() {
        if (!this.selectedTriggerKey) return;

        this.editingTemplate = {
            name: 'New Template',
            channel: 'EMAIL',
            trigger: this.selectedTriggerKey,
            subject: '',
            body: '',
            isActive: true
        };
        this.editingTemplateIndex = -1;
    }

    editTemplate(template: any) {
        this.editingTemplate = { ...template };
        this.editingTemplateIndex = this.templates.indexOf(template);
    }

    saveTemplate() {
        if (!this.editingTemplate) return;

        if (!this.editingTemplate.name || !this.editingTemplate.channel) {
            return;
        }

        // Channel specific validation
        if (this.editingTemplate.channel === 'EMAIL') {
            if (!this.editingTemplate.subject || !this.editingTemplate.body) return;
        } else if (this.editingTemplate.channel === 'SMS' || this.editingTemplate.channel === 'INAPP') {
            if (!this.editingTemplate.body) return;
        }

        if (this.editingTemplateIndex > -1) {
            this.templates[this.editingTemplateIndex] = this.editingTemplate;
        } else {
            this.templates.push(this.editingTemplate);
            // Auto-enable trigger
            if (this.editingTemplate.trigger) {
                this.triggers[this.editingTemplate.trigger] = true;
            }
        }
        this.editingTemplate = null;
        this.editingTemplateIndex = -1;
    }

    cancelEditTemplate() {
        this.editingTemplate = null;
        this.editingTemplateIndex = -1;
    }

    removeTemplate(template: any) {
        const index = this.templates.indexOf(template);
        if (index > -1) {
            this.templates.splice(index, 1);
        }
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
            case 'step': return this.step?.id;
            case 'task': return this.task?.id;
            default: return null;
        }
    }
}
