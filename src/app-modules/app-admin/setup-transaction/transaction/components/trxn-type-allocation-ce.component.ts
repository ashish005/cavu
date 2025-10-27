import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BankingAPIResolver} from "../services/api.resolver";
import {ACTION_ENUM} from "@app-global";
import {TrxnTypeAllocationForm} from "../forms/trxn-type-allocation.form";
import {TrxnTypeAllocationService} from "../services/trxn-type-allocation.service";

@Component({
  standalone: false,
    templateUrl: './templates/trxn-type-allocation-ce.html',
    styles:[`:host { display: contents; }`]
})
export class TrxnTypeAllocationCeComponent extends TrxnTypeAllocationForm implements  OnInit{
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    submitted: boolean = false;
    @Input() id: string;
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() set data (val){ this.customForm.patchValue(val); }

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    constructor(public fb: FormBuilder, public apiResolver: BankingAPIResolver, public service: TrxnTypeAllocationService){
        super(fb);
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

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
