import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";
import {Vehicle} from "../domains/vehicle.serializer";

@Directive()
export class VehicleForm
{
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            ownerUserId: [null],
            ownerName: [null, Validators.required],
            ownerEmail: [null, Validators.required],
            ownerPhone: [null, Validators.required],

            isDriveByOwner: [null],

            //Contractor
            contractorId: [null],
            contractorName: [null],
            contractTypeId: [null],
            contractAmount: [null],
            inspectionFrequency: [null, Validators.required],

            fName: [null],
            lName: [null],
            email: [null],
            phone: [null],

            vehicleNo: [null, Validators.required],
            registrationValidity: [null],
            modelId: [null, Validators.required],
            mileage: [null],
            mileageType: [null],

            fuelTypeId: [null, Validators.required],
            reportTypeId: [null, Validators.required],

            insuranceNo: [null],
            insuranceValidity: [null],
            insuranceCompanyId: [null, Validators.required],
            insuranceTypeId: [null, Validators.required],

            planId: [null],

            registrationDocumentId: [null],
            insuranceDocumentId: [null]
        });
    }

    get formModelId() { return <FormGroup>this.customForm.get('modelId'); }

    get formFuelTypeId() { return <FormGroup>this.customForm.get('fuelTypeId'); }
    get formReportTypeId() { return <FormGroup>this.customForm.get('reportTypeId'); }
    get formInsuranceCompanyId() { return <FormGroup>this.customForm.get('insuranceCompanyId'); }
    get formInsuranceTypeId() { return <FormGroup>this.customForm.get('insuranceTypeId'); }

    get formMileage() { return <FormGroup>this.customForm.get('mileage'); }
    get formMileageType() { return <FormGroup>this.customForm.get('mileageType'); }

    get formPlanId() { return <FormGroup>this.customForm.get('planId'); }

    get formContractorId() { return <FormGroup>this.customForm.get('contractorId'); }
    get formContractTypeId() { return <FormGroup>this.customForm.get('contractTypeId'); }
    get formContractor() { return <FormGroup>this.customForm.get('contractorName'); }
    get formInspectionFrequency() { return <FormGroup>this.customForm.get('inspectionFrequency'); }

    updateModel(val){ this.formModelId.setValue(val); }
    updateFuelType(val){ this.formFuelTypeId.setValue(val); }
    updateReportType(val){ this.formReportTypeId.setValue(val); }
    updateInsuranceCompany(val){ this.formInsuranceCompanyId.setValue(val); }
    updateInsuranceType(val){ this.formInsuranceTypeId.setValue(val); }
    updateMileageType(val){ this.formMileageType.setValue(val); }
    updateContractType(val){ this.formContractTypeId.setValue(val); }
    updateInspectionFrequency(val){ this.formInspectionFrequency.setValue(val); }

    updatePlan(val){ this.formPlanId.setValue(val); }

    updateContractorId(val: any){
        const { id, name} = val || {};
        this.formContractorId.setValue(id, { emitEvent: false});
        this.formContractor.setValue(name, { emitEvent: false});
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populate(item: Vehicle){
        const {
            ownerName, ownerEmail, ownerPhone,
            contractorId, contractorName, inspectionFrequency,
            vehicleNo, modelId, mileage, mileageType,
            fuelTypeId, reportTypeId, contractTypeId, contractAmount,
            insuranceCompanyId, insuranceTypeId,
            registrationValidity, insuranceNo, insuranceValidity,
            isDriveByOwner, planId
        } = item || {};
        this.customForm.get('ownerName').setValue(ownerName);
        this.customForm.get('ownerEmail').setValue(ownerEmail);
        this.customForm.get('ownerPhone').setValue(ownerPhone);

        this.customForm.get('vehicleNo').setValue(vehicleNo);

        this.customForm.get('fuelTypeId').setValue(fuelTypeId);
        this.customForm.get('modelId').setValue(modelId);
        this.customForm.get('mileage').setValue(mileage);
        this.customForm.get('mileageType').setValue(mileageType);

        this.customForm.get('contractTypeId').setValue(contractTypeId);
        this.customForm.get('contractAmount').setValue(contractAmount);
        this.customForm.get('contractorId').setValue(contractorId);
        this.customForm.get('contractorName').setValue(contractorName);
        this.customForm.get('inspectionFrequency').setValue(inspectionFrequency);

        this.customForm.get('reportTypeId').setValue(reportTypeId);
        this.customForm.get('insuranceCompanyId').setValue(insuranceCompanyId);
        this.customForm.get('insuranceTypeId').setValue(insuranceTypeId);

        this.customForm.get('registrationValidity').setValue(registrationValidity);
        this.customForm.get('insuranceNo').setValue(insuranceNo);
        this.customForm.get('insuranceValidity').setValue(insuranceValidity);
        this.customForm.get('isDriveByOwner').setValue(isDriveByOwner);
        this.customForm.get('planId').setValue(planId);

        if(item.id){
            this.customForm.get('ownerName').disable();
            this.customForm.get('ownerEmail').disable();
            this.customForm.get('ownerPhone').disable();
        }
    }
}