import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Account} from "../domains/account.serializer";

export class AccountForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: ['', Validators.required],
            printName: ['', Validators.required],
            accountGroupId: ['', Validators.required],

            openingBalance: [0],
            openingBalanceDate: [null],
            balance: [0],

            creditDaysSale: [0],
            creditDaysPurchase: [0],

            billByBill: [false],
            creditLimit: [0],

            currentYearBalance: [0],
            previousYearBalance: [0],
            currentQtrBalance: [0],
            previousQtrBalance: [0]
        });
    }

    get formAccountGroup() {
        return <FormGroup>this.customForm.get('accountGroupId');
    }

    updateAccountGroup(val){
        this.formAccountGroup.setValue(val);
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populateAccount(item: Account = <Account>{})
    {
        item.openingBalanceDate = item.openingBalanceDate;
        this.customForm.patchValue(item);
        /*this.customForm.get('name').setValue(item.name);
        this.customForm.get('printName').setValue(item.printName);

        this.customForm.get('accountGroupId').setValue(item.accountGroupId);
        this.customForm.get('openingBalance').setValue(item.openingBalance);
        this.customForm.get('openingBalanceDate').setValue(item.openingBalanceDate);*/
    }
}