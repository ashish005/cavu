import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {OrgWorkflowPhase, OrgWorkflowPhaseStatus, OrgWorkflowPhaseTransition, WorkflowNode} from "../../domains/org-workflow-node.serializer";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WorkflowPhaseStatusLookup} from "@app-global";

@Component({
    selector: 'transition-editor',
    standalone: false,
    templateUrl: './transition-editor.html',
    styleUrls: [ `./transition-editor.css`]
})
export class TransitionEditorComponent {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate!: TemplateRef<any>;
    @Input() process?: WorkflowNode;
    @Input() phases?: OrgWorkflowPhase[];
    @Input() statuses?: WorkflowPhaseStatusLookup[];
    @Input() sourcePhaseId?: number;
    @Input() sourceStatusId?: number;
    @Input() transitions?: OrgWorkflowPhaseTransition[];
    @Input() newTransition?: OrgWorkflowPhaseTransition;
    // @Input() transition: OrgWorkflowPhaseTransition = <OrgWorkflowPhaseTransition>{ id: 0, processId: 0, fromPhaseId: 0, toPhaseId: 0, rule: '' };
    
    activeStatusId: number | null = null;

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
        processId: [null, Validators.required],
        fromPhaseId: [null, Validators.required],
        fromStatusId: [null],
        destinations: this.fb.array([])
    });

    @Output() onOk: EventEmitter<any> = new EventEmitter();
    @Output() onCancel: EventEmitter<any> = new EventEmitter();

    constructor(private fb: FormBuilder) {}

    get destinations(): FormArray { return this.customForm.get('destinations') as FormArray; }

    ngOnInit() {
        if (this.process) {
            this.customForm.patchValue(<any>{ processId: this.process.id });
        }
        
        // Set Source Phase (Fixed)
        if (this.sourcePhaseId) {
            this.customForm.patchValue({
                fromPhaseId: this.sourcePhaseId as any
            });
            this.customForm.get('fromPhaseId')?.disable();
        }

        // Set Initial Active Status
        if (this.sourceStatusId !== undefined) {
            this.activeStatusId = this.sourceStatusId;
        } else if (this.newTransition) {
             this.activeStatusId = this.newTransition.fromStatusId ?? null;
        } else {
            // Default to first status or null
            const statuses = this.currentPhaseStatuses;
            if (statuses && statuses.length > 0) {
                this.activeStatusId = statuses[0].id;
            } else {
                this.activeStatusId = null;
            }
        }

        // Initialize Destinations
        const all = [...(this.transitions || [])];
        if (this.newTransition) {
            // Only add new transition if it matches the current active status (or if we want to add it to the list generally)
            // But usually newTransition has the sourceStatusId set.
            all.push(this.newTransition);
        }

        all.forEach(t => this.addDestinationGroup(t));
        
        // If empty for current status, add one? 
        // No, let user add explicitly.
    }

    get currentPhaseStatuses(): any[] {
        return this.statuses || [];
    }

    selectStatus(statusId: number | null) {
        this.activeStatusId = statusId;
    }

    getStatusName(statusId: number | null): string {
        if (statusId === null) return 'Any Status';
        const s = (this.statuses || []).find(x => x.id === statusId);
        return s ? s.name : 'Unknown';
    }

    addDestinationGroup(t?: OrgWorkflowPhaseTransition) {
        const group = this.fb.group({
            id: [t?.id || 0],
            fromStatusId: [t?.fromStatusId ?? this.activeStatusId], // Store fromStatusId in group
            toPhaseId: [t?.toPhaseId, Validators.required],
            toStatusId: [t?.toStatusId],
            description: [t?.description],
            ruleJoinType: ['AND'],
            rules: this.fb.array([])
        });

        if (t?.rule) {
            this.parseRulesIntoGroup(group, t.rule);
        }

        this.destinations.push(group);
    }

    addDestination() {
        this.addDestinationGroup();
    }

    removeDestination(index: number) {
        this.destinations.removeAt(index);
    }

    getRules(destIndex: number): FormArray {
        return this.destinations.at(destIndex).get('rules') as FormArray;
    }

    addRule(destIndex: number, rule?: any): void {
        const fg = this.fb.group({
            propertyName: [rule?.propertyName, Validators.required],
            operator: [rule?.operator, Validators.required],
            value: [rule?.value],
            isActive: [rule?.isActive ?? true]
        });
        this.getRules(destIndex).push(fg);
    }

    removeRule(destIndex: number, ruleIndex: number): void {
        this.getRules(destIndex).removeAt(ruleIndex);
    }

    parseRulesIntoGroup(group: FormGroup, expression: string) {
        if (!expression) return;

        let joinType = 'AND';
        if (expression.includes(' OR ')) {
            joinType = 'OR';
        }
        group.patchValue({ ruleJoinType: joinType });

        const rulesStr = expression.split(joinType === 'AND' ? ' AND ' : ' OR ');
        const rulesArray = group.get('rules') as FormArray;

        rulesStr.forEach(rStr => {
            rStr = rStr.trim();
            const match = rStr.match(/^(\w+)\s+(==|!=|>=|<=|>|<|contains)\s+(.+)$/);
            if (match) {
                const fg = this.fb.group({
                    propertyName: [match[1], Validators.required],
                    operator: [match[2], Validators.required],
                    value: [match[3]],
                    isActive: [true]
                });
                rulesArray.push(fg);
            }
        });
    }

    buildConditionExpression(group: AbstractControl | null): string {
        if (!group) {
            return '';
        }

        const join = group.get('ruleJoinType')?.value || 'AND';
        const rules = (group.get('rules') as FormArray).value;

        return rules
            .filter((r: any) => r.isActive)
            .map((r: any) => `${r.propertyName} ${r.operator} ${r.value}`)
            .join(` ${join} `);
    }

    getPropertyType(prop: string): string { return this.ruleProperties.find(p => p.name === prop)?.type || 'string'; }

    getOperators(prop: string) { return (this.operatorsByType as any)[this.getPropertyType(prop)]; }

    save() {
        if (this.customForm.invalid) {
            return;
        }
        
        const formValue = this.customForm.getRawValue(); // Use getRawValue to include disabled fields
        const processId = formValue.processId || this.process?.id;
        const fromPhaseId = formValue.fromPhaseId;
        const fromStatusId = formValue.fromStatusId;

        const results: any[] = [];
        const currentIds: number[] = [];

        // Process current form items
        this.destinations.controls.forEach((c: any) => {
            const v = c.value;
            const payload: any = {
                id: v.id,
                processId: processId,
                fromPhaseId: fromPhaseId,
                fromStatusId: v.fromStatusId, // Use the status from the specific item
                toPhaseId: v.toPhaseId,
                toStatusId: v.toStatusId,
                description: v.description,
                rule: this.buildConditionExpression(c as FormGroup)
            };
            results.push(payload);
            if (v.id > 0) currentIds.push(v.id);
        });

        // Identify deletes
        const initialIds = (this.transitions || []).map(t => t.id).filter(id => id > 0);
        const toDelete = initialIds.filter(id => !currentIds.includes(id));

        this.onOk.emit({
            save: results,
            delete: toDelete
        });
    }
}
