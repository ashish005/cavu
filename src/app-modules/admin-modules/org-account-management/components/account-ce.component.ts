import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, Directive } from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ACTION_ENUM} from "@app-global";
import {AccountForm} from "../forms/account.form";
import {Account} from "../domains/account.serializer";
import {CoreAccountGroupLookup} from "../domains/lookup.serializer";
import {LedgerService} from "../services/ledger.service";
import {AccountingAPIResolver} from "../services";

@Component({
  standalone: false,
  selector: 'account-create-edit',
  templateUrl: './templates/account-ce.html'
})
export class AccountCreateEditComponent extends AccountForm implements OnInit {
  get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
  @Input() id: any;
  @Input() set data(item: Account) {
    this.populateAccount(item || <Account>{});
  };
  submitted: boolean = false;
  flatAccountGroup: Array<CoreAccountGroupLookup>;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  constructor(public override fb: FormBuilder, private service: LedgerService, public apiResolver: AccountingAPIResolver) {
    super(fb);
  }

  ngOnInit() {
    this.flatAccountGroup = this.apiResolver.masterType.getAllAccountGroup();
  }

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }

    const success = (resp)=> {
      this.submitted = false;
      this.onOk.emit(new Account(resp.data));
    };

    const error = (resp)=> {
      this.submitted = false;
    };

    this.submitted = true;
    if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
      this.service.update(this.id, form.value).subscribe(success, error);
    } else if(this.actionType == ACTION_ENUM.ADD) {
      this.service.create(form.value).subscribe(success, error);
    }
  }
}
