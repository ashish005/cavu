import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

export class OrgProcessForm
{
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id:[null],
            name: ['', Validators.required],
            description: [null, Validators.required],
            parentId: [null],
            inchargeId: [null],
            sortOrder: [null],

            proessPhase: [null],
            proessPhaseOn: [null],
            manualStatus: [null],
            manualStatusOn: [null],

            inchargeName: [null],
            phases: this.fb.array([]),
            //phaseTransitions: this.fb.array([]),
            isActive: [false ],
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get formInchargeId(){ return this.customForm.get('inchargeId'); }
    get formInchargeName(){ return this.customForm.get('inchargeName'); }
    get phases(): FormArray { return this.customForm.get('phases') as FormArray<FormGroup>; }
    addPhase(data?: any): void {
        const phase = this.fb.group({
            id: [data?.id],
            name: [data?.name, Validators.required],
            color: [data?.color || ''],
            phaseStatusId: [data?.phaseStatusId],
            sortOrder: [data?.sortOrder],
            isDefault: [data?.isDefault],
            isActive: [ !data? true: data?.isActive ],
        });
        this.phases.push(phase);
    }
    //get phaseTransitions(): FormArray { return this.customForm.get('phaseTransitions') as FormArray<FormGroup>; }
    /*addTransition(data?: any): void {
        const transitions = this.fb.group({
            id: [data?.id],
            description: [data?.description || ''],
            fromPhaseId: [data?.fromPhaseId],
            fromStatusId: [data?.fromStatusId],
            toPhaseId: [data?.toPhaseId],
            toStatusId: [data?.toStatusId],
            isActive: [!data? true: data?.isActive],
        });
        this.phaseTransitions.push(transitions);
    }*/
    updateInchargeId(val: any){
        const { id, name, userId } = val || {};
        this.formInchargeId.setValue(userId, { emitEvent: false});
        this.formInchargeName.setValue(name, { emitEvent: false});
    }
    populateOrgProcess(item: any){
        this.customForm.patchValue(item);
        this.phases.controls.length = 0;
        (item.phases || []).map(r => this.addPhase(r));

        // this.phaseTransitions.controls.length = 0;
        // (item.phaseTransitions || []).map(r => this.addTransition(r));
    }
}