import {Component, Input, TemplateRef, ViewChild} from "@angular/core";
import {OrgWorkflowPhase, OrgWorkflowPhaseStatus, OrgWorkflowPhaseTransition, WorkflowNode} from "../../domains/org-workflow-node.serializer";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WorkflowPhaseStatusLookup} from "@app-global";

@Component({
    selector: 'transition-editor',
    standalone: false,
    templateUrl: './transition-editor.html',
    styleUrls: [ `./transition-editor.css`]
})
export class TransitionEditorComponent {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    @Input() process?: WorkflowNode;
    @Input() phases?: OrgWorkflowPhase[];
    @Input() statuses?: WorkflowPhaseStatusLookup[];
    @Input() transition: OrgWorkflowPhaseTransition = <OrgWorkflowPhaseTransition>{ fromPhaseId: null, rule: '' };

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
        fromStatusId: [null],
        toPhaseId: [null, Validators.required],
        toStatusId: [null],
        description: [''],
        isActive: [true],
        ruleJoinType: ['AND'],
        rules: this.fb.array([])
    });

    onOk: (payload?: any) => void;
    onCancel: () => void;

    constructor(private fb: FormBuilder) {}

    get rules(): FormArray<FormGroup> { return this.customForm.get('rules') as FormArray<FormGroup>; }

    ngOnInit() {
        if (this.process) {
            this.customForm.patchValue(<any>{ processId: this.process.id });
        }
        if (this.transition) {
            this.customForm.patchValue(<any>{
                id: this.transition.id,
                fromPhaseId: this.transition.fromPhaseId,
                toPhaseId: this.transition.toPhaseId,
                description: this.transition.description
            });
        }
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

    removeRule(index: number): void { this.rules.removeAt(index); }

    buildConditionExpression(): string {
        const join = this.customForm.get('ruleJoinType')?.value || 'AND';

        return this.rules.value
            .filter(r => r.isActive)
            .map(r => `${r.propertyName} ${r.operator} ${r.value}`)
            .join(` ${join} `);
    }

    getPropertyType(prop: string): string { return this.ruleProperties.find(p => p.name === prop)?.type || 'string'; }

    getOperators(prop: string) { return this.operatorsByType[this.getPropertyType(prop)]; }

    save() {
        if (this.customForm.invalid) {
            return;
        }
        const value = this.customForm.value;
        const payload: any = {
            id: value.id,
            processId: value.processId || this.process?.id,
            fromPhaseId: value.fromPhaseId,
            toPhaseId: value.toPhaseId,
            description: value.description,
            ruleJoinType: value.ruleJoinType,
            rules: value.rules,
            rule: this.buildConditionExpression()
        };
        if (this.onOk) {
            this.onOk(payload);
        }
    }
}
