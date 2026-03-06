import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FeePaymentLookup} from "../domain/fee-payment.lookup";

@Component({ standalone: false, selector:'monthly-invoice-form', templateUrl: './templates/monthly-invoice-form.html' })
export class MonthlyInvoiceFormComponent {
  @Input() customForm: FormGroup;
  @Input() i: number;
  @Input() lookup: FeePaymentLookup;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  constructor(public fb: FormBuilder) {}

  get formSaleVoucherDetail() { return <FormArray>this.customForm.get('saleVoucherDetail');  }
  get formSundryDetail() { return <FormArray>this.customForm.get('sundryDetail'); }
  //get formSaleVoucherPayable() { return <FormArray>this.customForm.get('payable'); }

  get formVoucherTypeId() { return <FormGroup>this.customForm.get('voucherTypeId'); }
  get formTotalFee() { return <FormGroup>this.customForm.get('totalFee'); }
  get formInvoiceNo() { return <FormGroup>this.customForm.get('voucherNo'); }

  updateVoucherTypeId(val) { this.formVoucherTypeId.setValue(val); }

  voucherPayableUpdate(data: any) { this.cb.emit({  action: 'updateNetPayableAmount'}); }
}