export {WorkflowCeView} from "./workflow-ce/workflow-ce.view";

export {ProcessTreeComponent} from "./process-tree/process-tree.component";
export {PhaseListComponent} from "./phase-list/phase-list.component";
export {PhaseEditorComponent} from "./phase-editor/phase-editor.component";
export {TransitionEditorComponent} from "./transition-editor/transition-editor.component";
export {WorkflowCanvasComponent} from "./workflow-canvas/workflow-canvas.component";
export {PhaseStepTaskComponent, PhaseStepTaskActionCell} from "./phase-step-task/phase-step-task.component";
export {PhaseStepTaskEditorComponent} from "./phase-step-task-editor/phase-step-task-editor.component";
export {PhaseNotificationComponent} from "./phase-notification/phase-notification.component";
export {WorkflowNotificationTemplateComponent} from "./workflow-notification-template/workflow-notification-template.component";
export {NotificationWizardComponent} from "./notification-wizard/notification-wizard.component";

import {WorkflowCeView} from "./workflow-ce/workflow-ce.view";
import {ProcessTreeComponent} from "./process-tree/process-tree.component";
import {PhaseListComponent} from "./phase-list/phase-list.component";
import {PhaseEditorComponent} from "./phase-editor/phase-editor.component";
import {TransitionEditorComponent} from "./transition-editor/transition-editor.component";
import {WorkflowCanvasComponent} from "./workflow-canvas/workflow-canvas.component";
import {PhaseStepTaskComponent, PhaseStepTaskActionCell} from "./phase-step-task/phase-step-task.component";
import {PhaseStepTaskEditorComponent} from "./phase-step-task-editor/phase-step-task-editor.component";
import {PhaseNotificationComponent} from "./phase-notification/phase-notification.component";
import {
    WorkflowNotificationTemplateComponent
} from "./workflow-notification-template/workflow-notification-template.component";
import {NotificationWizardComponent} from "./notification-wizard/notification-wizard.component";


export const WORKFLOW_COMPONENTS = [
    WorkflowCeView,
    ProcessTreeComponent, PhaseListComponent, PhaseEditorComponent,
    TransitionEditorComponent, WorkflowCanvasComponent, PhaseStepTaskComponent, PhaseStepTaskActionCell, PhaseStepTaskEditorComponent,
    PhaseNotificationComponent, WorkflowNotificationTemplateComponent, NotificationWizardComponent
];
