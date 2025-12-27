import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProcessWorkflowView } from "./work-flow/process-workflow.view";
import { FilterTransitionsByFromPipe, FindPhaseStatusesPipe } from "./work-flow/pipes";
import { CommonModule } from "@angular/common";
import { CdkTreeModule } from '@angular/cdk/tree';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {ProcessTreeComponent} from "./work-flow/components/process-tree/process-tree.component";
import {PhaseListComponent} from "./work-flow/components/phase-list/phase-list.component";
import {PhaseEditorComponent} from "./work-flow/components/phase-editor/phase-editor.component";
import {TransitionEditorComponent} from "./work-flow/components/transition-editor/transition-editor.component";
import {WorkflowCanvasComponent} from "./work-flow/components/workflow-canvas/workflow-canvas.component";
import {SortByPipe} from "../../pipes/sort-by.pipe";

@NgModule({
    declarations: [
        ProcessWorkflowView,
        ProcessTreeComponent, PhaseListComponent, PhaseEditorComponent, TransitionEditorComponent,
        WorkflowCanvasComponent,
        FilterTransitionsByFromPipe, FindPhaseStatusesPipe
    ],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        CdkTreeModule, ScrollingModule, DragDropModule, SortByPipe
    ],
    exports: [ProcessWorkflowView]
})
export class CoreProcessWorkflowModule {}
