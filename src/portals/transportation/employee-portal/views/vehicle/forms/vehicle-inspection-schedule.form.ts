import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";
import {VehicleInspection, VehicleInspectionDetail} from "../domains/vehicle-inspection.serializer";

@Directive()
export class VehicleInspectionScheduleForm
{
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            vehicleId: [null, Validators.required],
            vehicleNo: [null],
            dueDate: [null, Validators.required],

            heads: this.fb.array([])
        });
    }

    get f() { return this.customForm.controls; }

    get formInspectionHeads() { return this.customForm.get('heads') as FormArray<FormGroup>; }

    populateForm(data: any) {
        const { vehicleId, vehicleNo, dueDate, heads } = data;
        this.customForm.get('vehicleId').setValue(vehicleId);
        this.customForm.get('vehicleNo').setValue(vehicleNo);
        this.customForm.get('vehicleNo').disable();

        this.customForm.get('dueDate').setValue(dueDate);

        this.formInspectionHeads.controls.length = 0;
        (heads || []).map((r) => this.addNewRow(r));
    }

    addNewRow(data) { this.formInspectionHeads.push(this.initItemRows(data)); }

    initItemRows(data: any) {
        const {
            id, vehicleId, inspectionHeadName, inspectionHeadId,
            dueDate, amount, serviceProvider, serviceStatus, certificateRequired, isActive
        } = data;
        return this.fb.group({
            id: [id || null],
            vehicleId: [vehicleId, Validators.required],
            inspectionHeadName: [inspectionHeadName || null],
            inspectionHeadId: [inspectionHeadId, Validators.required],
            dueDate: [dueDate || null],
            amount: [amount || null],
            serviceStatus: [ serviceStatus ],
            certificateRequired: [certificateRequired],
            isActive: [ isActive || false ]
        });
    }
}
