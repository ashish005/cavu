import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Phase, ProcessNode} from "../../models";
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
    @Input() process?: ProcessNode;
    @Input() phases: Phase[] = [];
    @Output() select = new EventEmitter<Phase>();
    @Output() edit = new EventEmitter<Phase>();
    @Output() create = new EventEmitter<Phase>();
}
