import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Phase, PhaseStep, WorkflowNode} from "../../domains/org-workflow-node.serializer";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'phase-list',
    standalone: false,
    templateUrl: './phase-list.html',
    animations: [
        trigger('fade', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('150ms', style({ opacity: 1 }))
            ])
        ])
    ],
})
export class PhaseListComponent {
    @Input() process?: WorkflowNode;
    @Input() phases: Phase[] = [];
    @Output() select = new EventEmitter<Phase>();
    @Output() edit = new EventEmitter<Phase>();
    @Output() create = new EventEmitter<void>();

    @Output() notification = new EventEmitter<Phase>();
    @Output() manageTemplates = new EventEmitter<Phase>();
    @Output() showStepTask = new EventEmitter<PhaseStep>();
    @Output() editStep = new EventEmitter<PhaseStep>();
    @Output() notificationStep = new EventEmitter<PhaseStep>();
}
