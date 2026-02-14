import {
    AfterViewInit,
    Component, EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

import {OrgWorkflowPhase} from "../../domains/org-workflow-node.serializer";
import {OrgWorkflowPhaseService, WorkflowService} from "../../services/workflow.service";

@Component({
    standalone: false,
    templateUrl: './phase-editor.html',
    styleUrls: [ `./phase-editor.css`]
})
export class PhaseEditorComponent implements OnInit, AfterViewInit {
    submitted: boolean = false;
    @Output() onOk: EventEmitter<any> = new EventEmitter(null);
    @Output() onCancel: EventEmitter<any> = new EventEmitter(null);
    @ViewChild('footerTemplate', { static: true }) public footerTemplate!: TemplateRef<any>;
    @Input() data?: OrgWorkflowPhase;
    customForm: FormGroup;
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

    isEdit: boolean = false;
    constructor(
        private fb: FormBuilder,
        private service: OrgWorkflowPhaseService
    ) {
        this.customForm = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            color: [null],
            sortOrder: [null],
            isDefault: [ false ] ,
            isActive: [ true ],
            steps: this.fb.array([])
        });
    }

    get f() { return this.customForm.controls; }

    get steps(): FormArray<FormGroup> {
        return this.customForm.get('steps') as FormArray<FormGroup>;
    }

    rules(stepIndex: number): FormArray<FormGroup> {
        return this.steps.at(stepIndex).get('rules') as FormArray<FormGroup>;
    }

    addStep(step?: any): void {
        step = step || {
            sortOrder: this.steps.length + 1,
            isActive: true
        };

        const fg = this.fb.group({
            id: [step.id],
            sortOrder: [step.sortOrder],
            name: [step.name, Validators.required],
            assignedToRole: [step.assignedToRole, Validators.required],

            isActive: [step.isActive],
            slaHours: [step.slaHours],
            // ✅ MUST EXIST
            ruleJoinType: [step.ruleJoinType ?? 'AND'],
            rules: this.fb.array([])
        });

        this.steps.push(fg);
        (step.rules || []).forEach((r: any) => this.addRule(r, this.steps.length - 1));
    }

    removeStep(stepIndex: number): void {
        this.steps.removeAt(stepIndex);
        this.reorderSteps();
    }

    addRule(rule: any, stepIndex: number): void {

        rule = rule || {};

        const fg = this.fb.group({
            id: [rule.id],
            propertyName: [rule.propertyName, Validators.required],
            operator: [rule.operator],
            value: [rule.value],
            isActive: [rule.isActive ?? true],
            slaHours: [rule.slaHours]
        });

        fg.get('operator')?.valueChanges?.subscribe(op => {
            const valueCtrl = fg.get('value');
            op === 'isNull'
                ? valueCtrl?.disable()
                : valueCtrl?.enable();
        });

        this.rules(stepIndex).push(fg);
    }

    removeRule(stepIndex: number, ruleIndex: number): void {
        this.rules(stepIndex).removeAt(ruleIndex);
        this.reorderRules(stepIndex);
    }

    private reorderSteps(): void {
        this.steps.controls.forEach((ctrl, index) => {
            ctrl.get('stepOrder')?.setValue(index + 1, { emitEvent: false });
        });
    }

    private reorderRules(stepIndex: number): void {
        this.rules(stepIndex).controls.forEach((ctrl, index) => {
            // purely visual, index-based
        });
    }

    buildRuleExpression(stepIndex: number): string {
        const step = this.steps.at(stepIndex);
        const join = step.get('ruleJoinType')?.value || 'AND';
        const rules = this.rules(stepIndex).value;

        if (!rules.length) return '';

        return rules
            .filter(r => r.isActive)
            .map(r => `${r.propertyName} ${r.operator} ${r.value}`)
            .join(` ${join} `);
    }

    getPropertyType(prop: string): string {
        return this.ruleProperties.find(p => p.name === prop)?.type || 'string';
    }

    getOperators(prop: string) {
        const typeKey = this.getPropertyType(prop) as 'string' | 'number' | 'date';
        return this.operatorsByType[typeKey];
    }

    ngOnInit() {
        if (this.data) {
            this.customForm.patchValue({
                id: this.data.id,
                name: this.data.name,
                color: this.data.color,
                sortOrder: this.data.sortOrder,
                isDefault: false,
                isActive: true
            });
            this.steps.clear();
            (this.data.steps || []).forEach(s => this.addStep(s));
        }
    }

    ngAfterViewInit() {}

    savePhase(form: any){
        if (this.customForm.invalid) { return; }

        this.submitted = true;
        const payload = { ...this.customForm.value };
        payload.processId = this.data?.processId;
        // payload.steps = this.steps.controls.map((ctrl, idx) => {
        //     const v = ctrl.value;
        //     return {
        //         id: v.id,
        //         stepOrder: v.stepOrder,
        //         name: v.name,
        //         assignedToRole: v.assignedToRole,
        //         isActive: v.isActive,
        //         ruleJoinType: v.ruleJoinType,
        //         rule: this.buildRuleExpression(idx)
        //     };
        // });

        const isUpdate = !!payload.id;
        const req$ = isUpdate
            ? this.service.update(payload.id, payload)
            : this.service.create(payload);
        const success = (resp: any) => { this.submitted = false; this.onOk.emit(resp); };
        const failure = (e: any) => { this.submitted = false; this.onOk.emit(e); };
        req$.subscribe(success, failure);

    }
}
