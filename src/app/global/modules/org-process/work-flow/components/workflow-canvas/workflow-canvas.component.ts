import {animate, style, transition, trigger} from "@angular/animations";
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { Node, Edge } from '@swimlane/ngx-graph';
import {BehaviorSubject, Subject} from "rxjs";
import {Phase, PhaseTransition} from "../../models";
export interface WorkflowRuntimeState {
    currentPhaseId: number;
    completedTransitionIds: number[];
}

@Component({
    selector: 'workflow-canvas',
    standalone: false,
    styleUrls: [ `./workflow-canvas.css` ],
    animations: [
        trigger('draw', [
            transition(':enter', [
                style({ strokeDashoffset: 200 }),
                animate('400ms ease-out', style({ strokeDashoffset: 0 }))
            ])
        ])
    ],
    templateUrl: './workflow-canvas.html'
})
export class WorkflowCanvasComponent {
    @Input() phases: Phase[] = [];
    transitions: PhaseTransition[] = [];

    /** runtime active items */
    @Input() activePhaseIds: number[] = [];
    @Input() activeTransitionIds: number[] = [];

    /** expose edit actions */
    @Output() editPhase = new EventEmitter<Phase>();
    @Output() editTransition = new EventEmitter<PhaseTransition>();
    @Output() nodeMoved = new EventEmitter<{ id: number; x: number; y: number }>();

    zoomToFit$ = new BehaviorSubject<boolean>(false);

    nodes: Node[] = [];
    links: Edge[] = [];

    generateTransitions(phases: Phase[]): any[] {
        const ordered = [...phases].sort((a, b) => a.order - b.order);

        return ordered.slice(0, -1).map((p, i) => ({
            id: i + 1,
            fromPhaseId: p.id,
            toPhaseId: ordered[i + 1].id,
            description: `${p.name} → ${ordered[i+1].name}`
        }));
    }

    ngOnChanges() {
        this.nodes = (this.phases || []).map<Node>(p => ({
            id: `p-${p.id}`,
            label: p.name ?? '',
            position: p.position,
            data: {
                color: p.color,
                model: p
            }
        }));

        this.links = this.generateTransitions(this.phases).map<Edge>(t => ({
            id: `l-${t.id}`,
            source: `p-${t.fromPhaseId}`,
            target: `p-${t.toPhaseId}`,
            label: t.description ?? '',
            data: {
                rule: t.rule,
                model: t
            }
        }));

        this.zoomToFit$.next(true);
    }

    onDragEnd(evt: any) {
        const { node, x, y } = evt;
        this.nodeMoved.emit({ id: +node.id, x: x, y: y });
    }

    isPhaseActive(id: string) {
        return this.activePhaseIds?.includes(+id);
    }

    isLinkActive(id: string) {
        return this.activeTransitionIds?.includes(+id);
    }
}