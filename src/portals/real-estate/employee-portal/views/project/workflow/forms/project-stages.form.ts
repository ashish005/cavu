import {Directive, EventEmitter, Output} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Directive()
export class ProjectStagesForm {
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: ['', Validators.required],
            divisionId: ['', Validators.required],
            projectId: ['', Validators.required],
            description: [null],
            estimatedCost: [null],
            estimatedStartDate: [null],
            approvedCost: [null],
            actualStartDate: [null],
            statusRemark: [null],
            auditedById: [null],
            auditedDate: [null],
            empExecutiveId: [null],
            saleOrderId: [null],
            empExecutive: [null]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formProjectDivisionId() {
        return <FormGroup>this.customForm.get('divisionId');
    }
    get formEmpExecutiveId() {
        return <FormGroup>this.customForm.get('empExecutiveId');
    }
    get formEmpExecutive() {
        return <FormGroup>this.customForm.get('empExecutive');
    }
    get formSaleOrderId() {
        return <FormGroup>this.customForm.get('saleOrderId');
    }

    updateProjectDivision(val){
        this.formProjectDivisionId.setValue(val);
    }
    updateSaleOrder(val){
        this.formSaleOrderId.setValue(val);
    }

    updateEmployeeExecutive(data: any){
        this.formEmpExecutiveId.setValue(data?.id);
    }

    populateProjectService(item: any){
        /*const {
            name, divisionId, projectId, saleOrderId, description,
            empExecutiveId, empExecutive,
            estimatedCost, estimatedStartDate, approvedCost, actualStartDate
        } = item || {};
        this.customForm.get('name').setValue(name);
        this.customForm.get('projectId').setValue(projectId);
        this.customForm.get('empExecutiveId').setValue(empExecutiveId);
        this.customForm.get('divisionId').setValue(divisionId, { emitEvent: false });
        this.customForm.get('description').setValue(description);
        this.customForm.get('estimatedCost').setValue(estimatedCost);
        this.customForm.get('estimatedStartDate').setValue(estimatedStartDate);
        this.customForm.get('approvedCost').setValue(approvedCost);
        this.customForm.get('actualStartDate').setValue(actualStartDate);
        this.customForm.get('empExecutive').setValue(empExecutive);*/
    }
}