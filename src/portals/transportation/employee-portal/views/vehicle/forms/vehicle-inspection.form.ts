import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";
import {VehicleInspection, VehicleInspectionDetail} from "../domains/vehicle-inspection.serializer";

@Directive()
export class VehicleInspectionForm
{
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            id: [null],
            vehicleId: [null, Validators.required],
            vehicleNo: [null],
            dueDate: [null],
            inspectionStatus: [null, Validators.required],

            inspectedById: [null],
            inspectedByName: [null],

            details: this.fb.array([])
        });
    }

    get f() { return this.customForm.controls; }

    get formInspectionDetails() { return this.customForm.get('details') as FormArray<FormGroup>; }

    populateForm(data: VehicleInspection) {
        const { id, vehicleId, vehicleNo, dueDate, inspectionStatus, inspectedById, inspectedByName,details } = data;
        this.customForm.get('id').setValue(id);
        this.customForm.get('vehicleId').setValue(vehicleId);
        this.customForm.get('vehicleNo').setValue(vehicleNo);
        this.customForm.get('vehicleNo').disable();

        this.customForm.get('dueDate').setValue(dueDate);
        this.customForm.get('inspectionStatus').setValue(inspectionStatus);
        this.customForm.get('inspectedById').setValue(inspectedById);
        this.customForm.get('inspectedByName').setValue(inspectedByName);

        this.formInspectionDetails.controls.length = 0;
        (details || []).map((r) => this.addNewRow(r));
    }

    addNewRow(data) { this.formInspectionDetails.push(this.initItemRows(data)); }

    initItemRows(data: VehicleInspectionDetail) {
        const { id, inspectionHeadName, inspectionHeadId, inspectionScheduleId, rateInspection, isInspected, inspectionStatus, isRepairRequired, remark } = data;
        return this.fb.group({
            id: [id, Validators.required],
            inspectionHeadName: [inspectionHeadName || null],
            inspectionHeadId: [inspectionHeadId, Validators.required],
            inspectionScheduleId: [inspectionScheduleId || null],
            rateInspection: [rateInspection || null],
            isInspected: [ isInspected || false ],
            inspectionStatus: [ inspectionStatus ],
            isRepairRequired: [ isRepairRequired || false ],
            remark: [ remark ],
        });
    }

    get formInspectedById() { return <FormGroup>this.customForm.get('inspectedById'); }
    get formInspectedBy() { return <FormGroup>this.customForm.get('inspectedByName'); }
    get formInspectionStatus() { return <FormGroup>this.customForm.get('inspectionStatus'); }

    updateInspectionStatus(val){ this.formInspectionStatus.setValue(val); }
    updateContractorId(val: any){
        const { id, name} = val || {};
        this.formInspectedById.setValue(id, { emitEvent: false});
        this.formInspectedBy.setValue(name, { emitEvent: false});
    }
}
