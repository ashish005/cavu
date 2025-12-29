import { Pipe, PipeTransform } from '@angular/core';
import { Phase, PhaseStatus, PhaseTransition } from '../models';

@Pipe({ standalone: false, name: 'filterTransitionsByFrom' })
export class FilterTransitionsByFromPipe implements PipeTransform {
    transform(transitions: PhaseTransition[], fromPhaseId: number, fromStatusId?: number) {
        if (!transitions) return [];
        return transitions.filter(t => t.fromPhaseId === fromPhaseId);
    }
}

@Pipe({ standalone: false, name: 'findPhaseStatuses' })
export class FindPhaseStatusesPipe implements PipeTransform {
    transform(phases: Phase[], phaseId: number): PhaseStatus[] {
        if (!phases || phaseId == null) return [];
        const p = phases.find(x => x.id === phaseId);
        return p ? p.statuses : [];
    }
}
