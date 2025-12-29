import {Component, Input, TemplateRef, ViewChild} from "@angular/core";
import {Phase, PhaseStatus, PhaseTransition, ProcessNode} from "../../models";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WorkflowPhaseStatusLookup} from "../../../../../services/orgwise/process.resolver";

@Component({
    selector: 'transition-editor',
    standalone: false,
    templateUrl: './transition-editor.html',
    styleUrls: [ `./transition-editor.css`]
})
export class TransitionEditorComponent {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    @Input() process?: ProcessNode;
    @Input() phases?: Phase[];
    @Input() statuses?: WorkflowPhaseStatusLookup[];
    transition: PhaseTransition = <PhaseTransition>{ fromPhaseId: null, rule: '' };

    ruleProperties = [
        { name: 'amount', label: 'Amount', type: 'number' },
        { name: 'department', label: 'Department', type: 'string' },
        { name: 'role', label: 'Role', type: 'string' },
        { name: 'priority', label: 'Priority', type: 'number' },
        { name: 'createdDate', label: 'Created Date', type: 'date' }
    ];

    operatorsByType = {
        string: [
            { value: '==', label: 'Equals' },
            { value: '!=', label: 'Not Equals' },
            { value: 'contains', label: 'Contains' }
        ],
        number: [
            { value: '==', label: '=' },
            { value: '!=', label: '!=' },
            { value: '>', label: '>' },
            { value: '<', label: '<' },
            { value: '>=', label: '>=' },
            { value: '<=', label: '<=' }
        ],
        date: [
            { value: '==', label: '=' },
            { value: '>', label: 'After' },
            { value: '<', label: 'Before' }
        ]
    };

    customForm = this.fb.group({
        id: [null],
        processId: [null, Validators.required],

        fromPhaseId: [null, Validators.required],
        toPhaseId: [null, Validators.required],

        description: [''],
        isActive: [true],

        // 🔥 Rule Engine (optional)
        ruleJoinType: ['AND'],
        rules: this.fb.array([])
    });

    constructor(private fb: FormBuilder) {}

    get rules(): FormArray<FormGroup> {
        return this.customForm.get('rules') as FormArray<FormGroup>;
    }
    addRule(rule?: any): void {
        const fg = this.fb.group({
            propertyName: [rule?.propertyName, Validators.required],
            operator: [rule?.operator, Validators.required],
            value: [rule?.value],
            isActive: [rule?.isActive ?? true]
        });

        this.rules.push(fg);
    }

    removeRule(index: number): void {
        this.rules.removeAt(index);
    }

    buildConditionExpression(): string {
        const join = this.customForm.get('ruleJoinType')?.value || 'AND';

        return this.rules.value
            .filter(r => r.isActive)
            .map(r => `${r.propertyName} ${r.operator} ${r.value}`)
            .join(` ${join} `);
    }

    getPropertyType(prop: string): string {
        return this.ruleProperties.find(p => p.name === prop)?.type || 'string';
    }

    getOperators(prop: string) {
        return this.operatorsByType[this.getPropertyType(prop)];
    }
}