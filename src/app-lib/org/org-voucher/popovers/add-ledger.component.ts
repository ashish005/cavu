import {Component, Directive, EventEmitter, Injector, Input, OnInit, Output, TemplateRef} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReportService} from "../services/report.service";
import {ACTION_ENUM} from "@app-global";

class Account {
    id: string;
    name: string;
    printName: string;
    accountGroupId: number;
    //businessId: number;
    openingBalance: number;
    openingBalanceDate: string;

    creditDaysSale: number;
    creditDaysPurchase: number;

    billByBill: boolean;
    creditLimit: number;
    isLocked: boolean;
    closingBalance: number;

    currentYearBalance: number;
    previousYearBalance: number;
    currentQtrBalance: number;
    previousQtrBalance: number;
    balance: number;

    constructor(model: any = <any>{}){
        const { id, name, printName, accountGroupId, openingBalance, openingBalanceDate,
            creditDaysSale, creditDaysPurchase, billByBill, creditLimit, isLocked, closingBalance,
            currentYearBalance, previousYearBalance, currentQtrBalance, previousQtrBalance, balance } = model;
        this.id = id;
        this.name = name;
        this.printName = printName;
        this.accountGroupId = accountGroupId;
        //this.businessId = model.businessId;
        this.openingBalance = openingBalance;
        this.openingBalanceDate =  openingBalanceDate;
        this.creditDaysSale = creditDaysSale;
        this.creditDaysPurchase = creditDaysPurchase;
        this.billByBill = billByBill;
        this.creditLimit = creditLimit;
        this.isLocked = isLocked || false;
        this.closingBalance = closingBalance;

        this.currentYearBalance = currentYearBalance;
        this.previousYearBalance = previousYearBalance;
        this.currentQtrBalance = currentQtrBalance;
        this.previousQtrBalance = previousQtrBalance;
        this.balance = balance;
    }
}

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

@Component({
    standalone: false,
    selector: 'add-ledger',
    templateUrl: './templates/add-ledger.html',
    styles: [`:host .popover {  max-width: 500px; }`]
})
export class AddLedgerComponent extends LedgerFormComponent implements OnInit {
    submitted: boolean = false;
    @Input() id: any;
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();
    actionType: any = ACTION_ENUM.ADD;

    constructor(public override fb: FormBuilder, public service: ReportService) {
        super(fb);
    }

    ngOnInit() {
        //this.service.syncAccountLookup();
    }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit({ refresh: true });
        };
        const error = (resp)=> {
            this.submitted = false;
        };
        this.submitted = true;
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            //this.service.updateProduct(this.id, form.value).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.createAccount(form.value).subscribe(success, error);
        }
    }
}