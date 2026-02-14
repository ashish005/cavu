import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {OrgWorkflowPhase, WorkflowNode} from "../../domains/org-workflow-node.serializer";
import {OrgWorkflowPhaseStepTask} from "../../domains/phase-step-task.serializer";

@Component({
  standalone: false,
  templateUrl: "./workflow-notification-template.html",
  styles: [`:host{ display: contents; }`]
})
export class WorkflowNotificationTemplateComponent {
  @ViewChild("footerTemplate", { static: true }) footerTemplate!: TemplateRef<any>;

  @Input() process?: WorkflowNode;
  @Input() phase?: OrgWorkflowPhase;
  @Input() task?: OrgWorkflowPhaseStepTask;
  @Input() templates: any[] = [];

  @Output() onOk: EventEmitter<any> = new EventEmitter(null);
  @Output() onCancel: EventEmitter<any> = new EventEmitter(null);

  editingIndex: number | null = null;
  editing: any = this.createEmptyTemplate();

  availableChannels: Array<{ id: string; name: string }> = [
    { id: "EMAIL", name: "Email" },
    { id: "SMS", name: "SMS" },
    { id: "INAPP", name: "In-app" }
  ];

  get contextLabel(): string {
    if (this.task) {
      return "Task";
    }
    return "Phase";
  }

  get contextTitle(): string {
    if (this.task) {
      return this.task.name || "";
    }
    return this.phase?.name || "";
  }

  ngOnInit() {
    this.templates = (this.templates || []).map(t => ({ ...t }));
    if (this.templates.length) {
      this.edit(0);
    } else {
      this.startNew();
    }
  }

  createEmptyTemplate() {
    return {
      name: "",
      channel: "EMAIL",
      mediaType: "EMAIL",
      subject: "",
      content: "",
      isActive: true
    };
  }

  startNew() {
    this.editingIndex = null;
    this.editing = this.createEmptyTemplate();
  }

  edit(index: number) {
    this.editingIndex = index;
    this.editing = { ...this.templates[index] };
  }

  saveCurrent() {
    if (!this.editing || !this.editing.name || !this.editing.channel) {
      return;
    }
    const item = { ...this.editing };
    if (this.editingIndex === null) {
      this.templates = [...this.templates, item];
      this.editingIndex = this.templates.length - 1;
    } else {
      const updated = [...this.templates];
      updated[this.editingIndex] = item;
      this.templates = updated;
    }
  }

  remove(index: number) {
    const updated = this.templates.filter((_, i) => i !== index);
    this.templates = updated;
    if (updated.length) {
      this.edit(0);
    } else {
      this.startNew();
    }
  }

  saveAndClose() {
    this.saveCurrent();
    if (this.onOk) {
      const payload = {
        context: this.task ? "task" : "phase",
        processId: this.process?.id,
        phaseId: this.phase?.id,
        taskId: this.task?.id,
        templates: this.templates
      };
      this.onOk.emit(payload);
    }
  }

  close() {
    this.onCancel.emit();
  }
}
