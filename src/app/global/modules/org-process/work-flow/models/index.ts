export interface ProcessNode {
    id: number;
    name: string;
    children?: ProcessNode[];

    expanded?: boolean;
    level: number;
    hasChildren: boolean;
    permissions?: string[];
}

export interface Phase {
    processId: number;
    id: number;
    name: string;
    order: number;
    phaseStatusId: number;
    color: string;
    position?: { x: number; y: number }; // optional for graph layout
    statuses: PhaseStatus[]; // statuses belonging to this phase
}

export interface PhaseStatus {
    id: number;
    phaseId: number;
    name: string;
    color?: string;
}

export interface PhaseTransition {
    id: number;
    processId: number;
    fromPhaseId: number;
    fromStatusId?: number;
    toPhaseId: number;
    toStatusId?: number;
    description?: string;
    rule?: string;
}