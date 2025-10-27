import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ViewExtender} from "@app-global";
import {Bank, BankQueryOptions} from "../domains/bank.serializer";
import {BankService} from "../services/bank-account.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'bank',
    templateUrl: './templates/bank.html',
    styles: [`:host { display: contents; }`],
})
export class BankComponent extends ViewExtender<Bank> implements OnInit {
    customForm: FormGroup;
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();
    @Output() addAccount: EventEmitter<any> = new EventEmitter<any>();

    override coreState: BankQueryOptions = new BankQueryOptions();
  constructor(public fb: FormBuilder,
              public override activatedRoute: ActivatedRoute,
              public override service: BankService) {
        super(activatedRoute, service);
        this.customForm = this.fb.group({
            name: ['', Validators.required]
        });
    }

    ngOnInit() {  super.populateGrid(); }

    showBankAccounts = (row: Bank) => this.cb.emit(row);
    createBankAccount = (row: Bank) => this.addAccount.emit(row);

    onSubmit(form){
        // stop here if form is invalid
        if (form.invalid) { return; }

        const success = (resp) => {
            this.submitted = false;
            this.customForm.reset();
            super.populateGrid();
        };
        const failure = (err) => { this.submitted = false; };

        this.submitted = true;
        const data = form.getRawValue();
        this.service.create(data).subscribe(success, failure);
    }
}
