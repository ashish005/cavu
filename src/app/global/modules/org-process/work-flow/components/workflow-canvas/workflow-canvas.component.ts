import {animate, style, transition, trigger} from "@angular/animations";
import { Component, Input, OnInit } from '@angular/core';

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
export class WorkflowCanvasComponent implements OnInit {

    @Input() phases: any[] = [];
    @Input() transitions: any[] = [];

    nodes: any[] = [];
    edges: any[] = [];

    curve:any;

    ngOnInit(): void {
        this.buildGraph();
    }

    /* ================= BUILD GRAPH ================= */

    buildGraph(): void {
        this.nodes = this.phases.map(p => this.mapPhaseToNode(p));
        this.edges = this.transitions.map(t => this.mapTransitionToEdge(t));
    }

    /* ================= NODE MAPPING ================= */

    private mapPhaseToNode(phase: any) {
        return {
            id: phase.id.toString(),
            label: phase.name,
            data: phase
        };
    }

    /* ================= EDGE MAPPING ================= */

    private mapTransitionToEdge(t: any) {
        return {
            id: t.id.toString(),
            source: t.fromPhaseId.toString(),
            target: t.toPhaseId.toString(),
            label: this.buildEdgeLabel(t),
            data: t
        };
    }

    private buildEdgeLabel(t: any): string {
        if (t.conditionExpression) {
            return t.conditionExpression;
        }

        if (t.fromStatus || t.toStatus) {
            return `${t.fromStatus?.name || '*'} → ${t.toStatus?.name || '*'}`;
        }

        return 'Transition';
    }

    /* ================= EVENTS ================= */

    onNodeSelect(node: any): void {
        console.log('Phase selected:', node.data);
        // 🔥 Hook: open Phase Editor
    }

    onEdgeSelect(edge: any): void {
        console.log('Transition selected:', edge.data);
        // 🔥 Hook: open Transition Rule Editor
    }

}