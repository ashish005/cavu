import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";
import {Account} from "../domains/account-book.serializer";

@Directive()
export class LedgerFormComponent {
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: ['', Validators.required],
            printName: ['', Validators.required],
            accountGroupId: [null, Validators.required],

            openingBalance: [0],
            openingBalanceDate: [null],

            creditDaysSale: [''],
            creditDaysPurchase: [''],

            billByBill: [false],
            creditLimit: [0],

            currentYearBalance: [0],
            previousYearBalance: [0],
            currentQtrBalance: [0],
            previousQtrBalance: [0],
            balance: [0],
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
        this.customForm.patchValue(<any>item);
        /*this.customForm.get('name').setValue(item.name);
        this.customForm.get('printName').setValue(item.printName);

        this.customForm.get('accountGroupId').setValue(item.accountGroupId);
        this.customForm.get('openingBalance').setValue(item.openingBalance);
        this.customForm.get('openingBalanceDate').setValue(item.openingBalanceDate);*/
    }
}