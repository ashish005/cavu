import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Compliance} from "../domains/compliance.serializer";

export class ComplianceForm {
    customForm: FormGroup;

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            description: [null],
            complianceTypeId: [null, Validators.required],

            regulatoryId: [null, Validators.required],
            taxRegimeId: [null], // Take this from Tax subscription Type
            subscriptionId: [null],

            taxRebateRate: [null],
            isExemptedForTaxation: [null],

            calculationType: [null],
            rate: [null],

            taskId: [null],
            orgTaskScheduleId: [null],

            empExecutiveId: [null],
            empExecutiveName: [null] //just for ui handling
            //details: fb.array([this.complianceDetailFormGroup({})]),
        });
    }

    complianceDetailFormGroup(data){
        const { id, year, month,
            lastDueAmount, saleAmount, taxAmount, rebateAmount, availableInputAmount, netPaidAmount,
            empExecutiveId, empExecutiveName
        } = data || {};
        return this.fb.group(<any>{
            id: [id || null],
            year: [year, Validators.required],
            month: [ month, Validators.required],
            lastDueAmount: [lastDueAmount],
            saleAmount: [saleAmount],
            taxAmount: [taxAmount],
            rebateAmount: [rebateAmount],
            availableInputAmount: [availableInputAmount],
            netPaidAmount: [netPaidAmount],
            empExecutiveId: [empExecutiveId],
            empExecutiveName: [empExecutiveName] //just for ui handling
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get formDetailsRule() { return <FormArray>this.customForm.get('details'); }
    get formComplianceTypeId() { return <FormGroup>this.customForm.get('complianceTypeId'); }
    get formRegulatoryId() { return <FormGroup>this.customForm.get('regulatoryId'); }
    get formSubscriptionId() { return <FormGroup>this.customForm.get('subscriptionId'); }
    get formIsTaxExempted() { return <FormGroup>this.customForm.get('isExemptedForTaxation'); }

    get formEmpExecutiveId(){ return this.customForm.get('empExecutiveId'); }
    get formEmpExecutive(){ return this.customForm.get('empExecutiveName'); }

    updateEmpExecutive(data: any){
        this.formEmpExecutiveId.setValue(data?.id);
        this.formEmpExecutive.setValue(data?.name);
    }

    mergeUpdate(row: Compliance) {
        const {
            id, name, description,
            complianceTypeId, regulatoryId,
            taxRegimeId, subscriptionId, taxRebateRate, isExemptedForTaxation, calculationType, rate,
            taskId, orgTaskScheduleId,
            empExecutiveId, empExecutiveName
        } = row;
        this.customForm.get('id').setValue(id);
        this.customForm.get('name').setValue(name);
        this.customForm.get('description').setValue(description);
        this.customForm.get('complianceTypeId').setValue(complianceTypeId);

        this.customForm.get('regulatoryId').setValue(regulatoryId);
        this.customForm.get('taxRegimeId').setValue(taxRegimeId);
        this.customForm.get('subscriptionId').setValue(subscriptionId);
        this.customForm.get('taxRebateRate').setValue(taxRebateRate);
        this.customForm.get('isExemptedForTaxation').setValue(isExemptedForTaxation);

        this.customForm.get('calculationType').setValue(calculationType);// || CALC_TYPE.PERCENTAGE
        this.customForm.get('rate').setValue(rate ||  '0.00');

        this.customForm.get('taskId').setValue(taskId);
        this.customForm.get('orgTaskScheduleId').setValue(orgTaskScheduleId);

        this.customForm.get('empExecutiveId').setValue(empExecutiveId);
        this.customForm.get('empExecutiveName').setValue(empExecutiveName);
    }
}
