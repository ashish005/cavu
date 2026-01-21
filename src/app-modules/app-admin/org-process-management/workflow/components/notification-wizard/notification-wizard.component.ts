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
    @Input() userTypes: any[] = [];
    @Input() notificationTypes: any[] = [];
    @Input() userRoles: any[] = [];

    onOk!: (payload?: any) => void;
    onCancel!: () => void;

    // UI State
    selectedTriggerKey: string | null = null;
    
    // Triggers
    triggers: { [key: string]: boolean } = {};
    availableTriggers: any[] = [];

    // Templates
    templates: any[] = [];
    activeTemplate: any = null;

    availableChannels = [
        { id: 'EMAIL', name: 'Email', icon: 'fa-envelope' },
        { id: 'SMS', name: 'SMS', icon: 'fa-comment' },
        { id: 'INAPP', name: 'In-App', icon: 'fa-bell' }
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

    selectTrigger(key: string) {
        this.selectedTriggerKey = key;
        const current = this.templates.filter(t => t.trigger === key);
        this.activeTemplate = current.length > 0 ? current[0] : null;
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
        this.templates = (this.settings.templates || []).map((t: any) => ({ 
            ...t,
            permissions: t.permissions || [] 
        }));
    }

    // --- Template Management ---

    addTemplate(channel: string = 'EMAIL') {
        if (!this.selectedTriggerKey) return;

        const newTemplate = {
            name: `${channel} Template`,
            channel: channel,
            trigger: this.selectedTriggerKey,
            subject: '',
            body: '',
            isActive: true,
            // New Notification Fields
            userTypeId: null,
            notificationTypeId: null,
            executionLink: '',
            appEvent: this.selectedTriggerKey,
            permissions: []
        };
        this.templates.push(newTemplate);
        this.activeTemplate = newTemplate;
        
        // Auto-enable trigger
        this.triggers[this.selectedTriggerKey] = true;
    }

    selectTemplate(template: any) {
        this.activeTemplate = template;
    }

    removeTemplate(template: any) {
        const index = this.templates.indexOf(template);
        if (index > -1) {
            this.templates.splice(index, 1);
        }
        if (this.activeTemplate === template) {
            this.activeTemplate = this.currentTemplates.length > 0 ? this.currentTemplates[0] : null;
        }
    }

    getChannelIcon(channelId: string) {
        const ch = this.availableChannels.find(c => c.id === channelId);
        return ch ? ch.icon : 'fa-envelope';
    }

    // Helper to toggle permission
    togglePermission(roleId: any) {
        if (!this.activeTemplate) return;
        if (!this.activeTemplate.permissions) this.activeTemplate.permissions = [];
        
        const index = this.activeTemplate.permissions.indexOf(roleId);
        if (index > -1) {
            this.activeTemplate.permissions.splice(index, 1);
        } else {
            this.activeTemplate.permissions.push(roleId);
        }
    }

    hasPermission(roleId: any) {
        return this.activeTemplate?.permissions?.includes(roleId);
    }

    get isValid() {
        return this.templates.every(t => {
            if (!t.name || !t.channel) return false;
            // Basic validation
            if (!t.userTypeId || !t.notificationTypeId) return false; 
            
            if (t.channel === 'EMAIL' && (!t.subject || !t.body)) return false;
            if ((t.channel === 'SMS' || t.channel === 'INAPP') && !t.body) return false;
            return true;
        });
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
