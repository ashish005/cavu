import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FeeType} from "../domains/fee-type.serializer";

export class FeeTypeForm {
    customForm: FormGroup;
    accountType: Array<any> = [
        {name: 'New Account', selected: true, id:1},
        {name: 'Use Existing Account', selected: false, id:2},
    ];
    activeAccType: number = 2;

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: ['', Validators.required],
            activeAccType: [this.activeAccType],
            accountName: ['', Validators.required],
            amount: [null, Validators.required],

            isRefundable: [false],
            defaultFrequencyTypeId: [null, Validators.required],
            defaultDay: [1],
            defaultMonth: [1],

            accountId: [null, Validators.required],//, Validators.requires
            defaultTaskId: [null],
            //voucherTypeId: [null, Validators.required],

            //defaultTaskName: [''],
            depositDurationType: [null],
            //depositDurationTypeName: [null],
            feeTaxes: this.fb.array([]),
            isActive: [false]
        });
    }

    get formDefaultDay() { return <FormGroup>this.customForm.get('defaultDay'); }
    updateDefaultDay(val){ this.formDefaultDay.setValue(val); }

    get formDefaultMonth() { return <FormGroup>this.customForm.get('defaultMonth'); }
    updateDefaultMonth(val){ this.formDefaultMonth.setValue(val); }

    get formActiveAccType() { return <FormGroup>this.customForm.get('activeAccType'); }

    toggleActiveAccType()
    {
        const val: any = (this.activeAccType == 2)?1:2;
        this.activeAccType = val;
        //this.formActiveAccType.setValue(val);

        if(val==1){
            this.customForm.get('accountName').setValidators([Validators.required]);
            this.customForm.get('accountName').enable();
            this.formAccount.disable();
        }
        if(val==2){
            this.formAccount.setValidators([Validators.required]);
            this.customForm.get('accountName').disable();
        }
    }

    get formFeeTypeId() { return <FormGroup>this.customForm.get('feeTypeId'); }

    get formAmount() { return <FormGroup>this.customForm.get('amount'); }

    get formAccount() { return <FormGroup>this.customForm.get('accountId'); }
    updateAccount(val){ this.formAccount.setValue(val); }

    get formDefaultFrequencyTypeId() { return <FormGroup>this.customForm.get('defaultFrequencyTypeId'); }

    get formTaskEvent() { return <FormGroup>this.customForm.get('defaultTaskId'); }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get feeTaxesForm(){
        return <FormArray>this.customForm.get('feeTaxes');
    }

    populateData(data: FeeType){
        this.customForm.get('name').setValue(data.name);
        this.customForm.get('amount').setValue(data.amount);
        this.customForm.get('accountName').setValue(data.accountName);

        this.customForm.get('isRefundable').setValue(data.isRefundable);
        this.customForm.get('accountId').setValue(data.accountId);

        this.customForm.get('defaultTaskId').setValue(data.defaultTaskId);

        this.customForm.get('defaultFrequencyTypeId').setValue(data.defaultFrequencyTypeId);
        this.customForm.get('depositDurationType').setValue(data.depositDurationType);
        this.customForm.get('defaultDay').setValue(data.defaultDay);
        this.customForm.get('defaultMonth').setValue(data.defaultMonth);
        if(data.accountId){
            this.activeAccType = 2;
            this.toggleActiveAccType();
        }
        this.feeTaxesForm.controls.length = 0;
        (data.feeTaxes || []).map((r)=> this.addNewRow(r));
    }

    initItemRows(data) {
        const form = this.fb.group({
            id: [ (data)?data.id:null],
            status: [ (data)?data.status:null],
            studyLevelTypeId: [ (data)?data.studyLevelTypeId:null, Validators.required],
            studyModeTypeId: [ (data)?data.studyModeTypeId:null, Validators.required],
            studyLevelTypeName: [ (data)?data.studyLevelTypeName:null, Validators.required],
            studyModeTypeName: [ (data)?data.studyModeTypeName:null, Validators.required],

            taxMapperId: [(data)?data.taxMapperId:null],

            name: [data?.name],
            rate: [data?.rate],
            // name: [{ value: data?.name, disabled: true}],
            // rate: [{ value: data?.rate || 0, disabled: true}],
        });
        return form;
    }

    addNewRow(data) {
        this.feeTaxesForm.push(this.initItemRows(data));
    }

    deleteRow(index: number) {
        this.feeTaxesForm.removeAt(index);
    }
}