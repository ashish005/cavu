import {
    Component, EventEmitter,
    Input,
    OnInit, Output,
    TemplateRef, ViewChild
} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BankAccountService} from "../services/bank-account.service";
import {ACTION_ENUM} from "@app-global";

class BankAccountForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            accountName: [null],
            bankAccountNo: [null],

            accountId: [null],
            bankId: [null],
            branchName: [null],
            branchAddress: [null],
            remark: [null],
            ifscCode: [null],
            micrCode: [null],
            Account: this.fb.group({
                id: [null],
                name: [null],
                printName: [null],
                openingBalance: [null],
                openingBalanceDate: [null],
                billByBill: [null],
                creditLimit: [null]
            })
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
}

@Component({
    standalone: false,
    templateUrl: './templates/bank-account-ce.html',
    styles:[`:host { display: contents; }`]
})
export class BankAccountCeComponent extends BankAccountForm implements  OnInit{
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    submitted: boolean = false;
    @Input() id: string;
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() set data (val){ this.customForm.patchValue(val); }

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    constructor(public override fb: FormBuilder, public service: BankAccountService){
        super(fb);
    }

    ngOnInit(){}

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }

        const success = (resp) => {
            this.submitted = false;
            this.onOk.emit(true);
        };

        const failure = (err) => {
            this.submitted = false;
        };

        this.submitted = true;
        const data = form.getRawValue();
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, data).subscribe(success, failure);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(data).subscribe(success, failure);
        }
    }
}
