import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {OrgWorkflowPhase, OrgWorkflowPhaseStep, WorkflowNode} from "../../domains/org-workflow-node.serializer";
import {OrgWorkflowPhaseStepTask} from "../../domains/phase-step-task.serializer";

export type NotificationContext = 'process' | 'phase' | 'task' | 'step';

export interface WizardTemplate {
    tempId: string;
    channel: string; // 'EMAIL', 'SMS', 'INAPP'
    name: string;
    subject: string;
    body: string;
    isActive: boolean;
}

export interface WizardNotification {
    id?: string;
    appEvent: string;
    name: string;
    userTypeId: number | null;
    notificationTypeId: number | null;
    executionLink: string;
    permissions: { userRoleId: any, isEnable: boolean }[];
    templates: WizardTemplate[];
    isActive: boolean;
}

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
        .hover-bold:hover { font-weight: bold; text-decoration: underline; }
        .cursor-pointer { cursor: pointer; }
    `]
})
export class NotificationWizardComponent implements OnInit {
    @ViewChild('footerTemplate', { static: true }) footerTemplate!: TemplateRef<any>;

    @Input() context: NotificationContext = 'phase';
    @Input() process?: WorkflowNode;
    @Input() phase?: OrgWorkflowPhase;
    @Input() step?: OrgWorkflowPhaseStep;
    @Input() task?: OrgWorkflowPhaseStepTask;
    
    // Initial settings
    @Input() settings: any = {};
    @Input() userTypes: any[] = [];
    @Input() notificationTypes: any[] = [];
    @Input() userRoles: any[] = [];

    @Output() onOk = new EventEmitter<any>();
    @Output() onCancel = new EventEmitter<void>();

    // UI State
    selectedTriggerKey: string | null = null;
    
    // Notifications State (Keyed by Trigger/AppEvent)
    notificationsMap: { [key: string]: WizardNotification[] } = {};
    availableTriggers: any[] = [];

    // Active Selection
    activeNotification: WizardNotification | null = null;
    activeTemplate: WizardTemplate | null = null;

    availableChannels = [
        { id: 'EMAIL', name: 'Email', icon: 'fa-envelope' },
        { id: 'SMS', name: 'SMS', icon: 'fa-comment' },
        { id: 'INAPP', name: 'In-App', icon: 'fa-bell' }
    ];

    constructor() {}

    ngOnInit() {
        this.initTriggers();
        this.initNotifications();
        
        // Select first trigger by default
        if (this.availableTriggers.length > 0) {
            this.selectedTriggerKey = this.availableTriggers[0].key;
            // Select first trigger
            this.selectTrigger(this.selectedTriggerKey as string);
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

    // --- Trigger Selection ---

    selectTrigger(key: string) {
        this.selectedTriggerKey = key;
        
        // Ensure array exists
        if (!this.notificationsMap[key]) {
            this.notificationsMap[key] = [];
        }

        // Auto-select first notification if exists, else activeNotification is null
        const list = this.notificationsMap[key];
        if (list.length > 0) {
            this.selectNotification(list[0]);
        } else {
            this.activeNotification = null;
            this.activeTemplate = null;
        }
    }

    get currentNotifications(): WizardNotification[] {
        if (!this.selectedTriggerKey) return [];
        return this.notificationsMap[this.selectedTriggerKey] || [];
    }

    get selectedTrigger() {
        return this.availableTriggers.find(t => t.key === this.selectedTriggerKey);
    }

    // --- Notification CRUD ---

    selectNotification(notification: WizardNotification) {
        this.activeNotification = notification;
        // Select first template if available
        if (notification.templates && notification.templates.length > 0) {
            this.activeTemplate = notification.templates[0];
        } else {
            this.activeTemplate = null;
        }
    }

    removeNotification(notification: WizardNotification) {
        if (!this.selectedTriggerKey) return;
        
        const list = this.notificationsMap[this.selectedTriggerKey];
        const index = list.indexOf(notification);
        if (index > -1) {
            list.splice(index, 1);
            
            // Re-select another one or clear
            if (this.activeNotification === notification) {
                this.activeNotification = list.length > 0 ? list[0] : null;
                this.selectNotification(this.activeNotification as WizardNotification); // re-trigger template selection
            }
        }
    }

    addNotification(triggerKey: string) {
        if (!this.notificationsMap[triggerKey]) {
            this.notificationsMap[triggerKey] = [];
        }
        const newNotif = this.createEmptyNotification(triggerKey);
        this.notificationsMap[triggerKey].push(newNotif);
        this.selectNotification(newNotif);
    }

    createEmptyNotification(triggerKey: string): WizardNotification {
        return {
            // tempId: this.generateId(), // Not in interface yet, add if needed or omit
            appEvent: triggerKey,
            name: '',
            isActive: true,
            userTypeId: null,
            notificationTypeId: null,
            executionLink: '',
            permissions: [],
            templates: []
        };
    }

    initTriggers() {
        // Check if workflowEvents are provided in settings
        if (this.settings.workflowEvents && this.settings.workflowEvents[this.context]) {
             this.availableTriggers = this.settings.workflowEvents[this.context];
        } else {
            console.warn(`No workflow events found for context: ${this.context}`);
            this.availableTriggers = [];
        }
    }

    initNotifications() {
        // Hydrate from settings
        const loaded: any[] = this.settings.notifications || [];
        
        loaded.forEach(n => {
            if (n.appEvent) {
                if (!this.notificationsMap[n.appEvent]) {
                    this.notificationsMap[n.appEvent] = [];
                }
                this.notificationsMap[n.appEvent].push({
                    ...n,
                    permissions: n.permissions || [],
                    templates: n.templates || [],
                    isActive: n.isActive !== false
                });
            }
        });
    }

    onUserTypeChange() {
        if (this.activeNotification) {
            this.activeNotification.permissions = [];
        }
    }

    get availableTokens(): string[] {
        const tokens = ['processName'];
        
        if (this.context === 'phase' || this.context === 'step' || this.context === 'task') {
            tokens.push('phaseName');
        }
        
        if (this.context === 'step' || this.context === 'task') {
            tokens.push('stepName');
        }

        if (this.context === 'task') {
            tokens.push('taskName', 'assigneeName', 'dueDate');
        }

        return tokens;
    }

    insertToken(token: string) {
        if (!this.activeTemplate) return;
        
        // Append to body by default
        const tokenStr = `{${token}}`;
        this.activeTemplate.body = (this.activeTemplate.body || '') + tokenStr;
    }

    // --- Template Management ---

    addTemplate(channel: string = 'EMAIL') {
        if (!this.activeNotification) return;

        const newTemplate: WizardTemplate = {
            tempId: this.generateId(),
            name: `${channel} Template`,
            channel: channel,
            subject: '',
            body: '',
            isActive: true
        };
        
        this.activeNotification.templates.push(newTemplate);
        this.activeTemplate = newTemplate;
    }

    selectTemplate(template: WizardTemplate) {
        this.activeTemplate = template;
    }

    removeTemplate(template: WizardTemplate) {
        if (!this.activeNotification) return;
        
        const index = this.activeNotification.templates.indexOf(template);
        if (index > -1) {
            this.activeNotification.templates.splice(index, 1);
        }
        
        if (this.activeTemplate === template) {
            this.activeTemplate = this.activeNotification.templates.length > 0 ? this.activeNotification.templates[0] : null;
        }
    }

    getChannelIcon(channelId: string) {
        const ch = this.availableChannels.find(c => c.id === channelId);
        return ch ? ch.icon : 'fa-envelope';
    }

    // Helper to toggle permission (Operates on Current Notification)
    togglePermission(roleId: any) {
        if (!this.activeNotification) return;
        
        const existingIndex = this.activeNotification.permissions.findIndex((p: any) => p.userRoleId === roleId);
        if (existingIndex > -1) {
             // If it exists, toggle
             this.activeNotification.permissions[existingIndex].isEnable = !this.activeNotification.permissions[existingIndex].isEnable;
        } else {
            // Add it
            this.activeNotification.permissions.push({ userRoleId: roleId, isEnable: true });
        }
    }

    hasPermission(roleId: any) {
        if (!this.activeNotification) return false;
        const perm = this.activeNotification.permissions.find((p: any) => p.userRoleId === roleId);
        return perm ? perm.isEnable : false;
    }

    get filteredUserRoles() {
        const notif = this.activeNotification;
        if (!notif || !notif.userTypeId) return this.userRoles;
        return this.userRoles.filter(r => r.userTypeId === notif.userTypeId); 
    }

    isInvalid(n: WizardNotification): boolean {
        if (!n.isActive) return false;
        if (!n.name) return true;
        if (!n.userTypeId || !n.notificationTypeId) return true;
        if (!n.templates || n.templates.length === 0) return true;
        return !n.templates.every(t => {
            if (!t.name) return false;
            if (t.channel === 'EMAIL' && (!t.subject || !t.body)) return false;
            if ((t.channel === 'SMS' || t.channel === 'INAPP') && !t.body) return false;
            return true;
        });
    }

    get isValid() {
        // Validate all active notifications
        // Iterate over all map values (arrays) and flatten
        const allNotifications = Object.values(this.notificationsMap).reduce((acc, val) => acc.concat(val), []);

        return allNotifications.filter(n => n.isActive).every(n => !this.isInvalid(n));
    }

    // --- Final Save ---

    save() {
        // Filter out inactive notifications
        const allNotifications = Object.values(this.notificationsMap).reduce((acc, val) => acc.concat(val), []);
        const activeNotifications = allNotifications.filter(n => n.isActive);

        const payload = {
            context: this.context,
            id: this.getEntityId(),
            notifications: activeNotifications
        };
        
        this.onOk.emit(payload);
    }

    cancel() {
        this.onCancel.emit();
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

    private generateId(): string {
        return Math.random().toString(36).substring(2, 11);
    }
}
