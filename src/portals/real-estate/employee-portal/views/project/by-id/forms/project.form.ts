import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";
import {Project} from "../domains/project.serializer";

@Directive()
export class ProjectForm
{
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: ['', Validators.required],
            shortName: [''],
            code: [''],
            description: [''],
            expectedStartDate: [],
            expectedDurationDays: [],
            expectedCost: [],

            projectTypeId: ['', Validators.required],
            billingTypeId: [''],
            divisionId: [''],

            startDate: [],
            endDate: [],

            hasMultiModule: [false],
            hasWorkFlow: [false],

            customerId: [''],
            managerId: [''],
            customerName: [null],
            managerName: [null]
        });
    }

    get formCustomerId() { return <FormGroup>this.customForm.get('customerId'); }
    get formCustomerName() { return <FormGroup>this.customForm.get('customerName'); }
    get formManagerId() { return <FormGroup>this.customForm.get('managerId'); }
    get formManagerName() { return <FormGroup>this.customForm.get('managerName'); }
    get formProjectTypeId() { return <FormGroup>this.customForm.get('projectTypeId'); }
    get formProjectBillingTypeId() { return <FormGroup>this.customForm.get('billingTypeId'); }
    get formProjectDivisionId() { return <FormGroup>this.customForm.get('divisionId'); }

    updateCustomer(val){ this.formCustomerId.setValue(val); }
    updateManager(val){ this.formManagerId.setValue(val); }

    updateCustomerById(val){
        const { id, orgUserId, userId, name} = val || {};
        this.formCustomerId.setValue(id, { emitEvent: false});
        this.formCustomerName.setValue(name, { emitEvent: false});
    }

    updateManagerById(val){
        const { id, orgUserId, userId, name} = val || {};
        this.formManagerId.setValue(id, { emitEvent: false});
        this.formManagerName.setValue(name, { emitEvent: false});
    }
    updateProjectType(val){ this.formProjectTypeId.setValue(val); }
    updateProjectBillingType(val){ this.formProjectBillingTypeId.setValue(val); }
    updateProjectDivision(val){ this.formProjectDivisionId.setValue(val); }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populateProject(item: Project = <Project>{}){
        const {
            name, shortName, code, description, expectedStartDate, expectedDurationDays, expectedCost,
            startDate, endDate,
            customerId, managerId,
            projectTypeId, billingTypeId, divisionId,
            hasMultiModule, hasWorkFlow,
            client, manager
        } = item || {};
        this.customForm.get('name').setValue(name);
        this.customForm.get('shortName').setValue(shortName);
        this.customForm.get('code').setValue(code);
        this.customForm.get('description').setValue(description);
        this.customForm.get('expectedStartDate').setValue(expectedStartDate);
        this.customForm.get('expectedDurationDays').setValue(expectedDurationDays);
        this.customForm.get('expectedCost').setValue(expectedCost);
        this.customForm.get('endDate').setValue(endDate);
        this.customForm.get('startDate').setValue(startDate);

        this.customForm.get('projectTypeId').setValue(projectTypeId);
        this.customForm.get('billingTypeId').setValue(billingTypeId);
        this.customForm.get('divisionId').setValue(divisionId);

        this.customForm.get('hasMultiModule').setValue(hasMultiModule);
        this.customForm.get('hasWorkFlow').setValue(hasWorkFlow);

        this.customForm.get('customerId').setValue(customerId);
        this.customForm.get('managerId').setValue(managerId);
        this.customForm.get('customerName').setValue(client?.name);
        this.customForm.get('managerName').setValue(manager?.name);
    }
}