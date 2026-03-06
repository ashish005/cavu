import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FeePaymentLookup, VoucherSundryType} from "../domain/fee-payment.lookup";
import {pairwise, startWith} from "rxjs";

@Component({
    standalone: false,
  selector: '[sundry-detail]',
  templateUrl: './templates/sundry-detail.html'
})
export class SundryDetailDirective implements OnInit {
  @Input() lookup: FeePaymentLookup;
  @Input() customForm: FormGroup;
  @Input() sundryForm: FormGroup;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

    roundOffType = {
        positive: 'Round off+',
        negative: 'Round off-',
    };
  constructor(public fb: FormBuilder) {}

  ngOnInit() {
      const itemFormValueChange = ([prev, next]: [any, any]) =>
      {
          if(prev != next)
          {
              const sundryType: VoucherSundryType = this.lookup.getSundryTypeBasedOnId(next) || new VoucherSundryType();
              this.formAccountId.setValue(sundryType.accountId);
              this.formAccountGroupId.setValue(sundryType.accountGroupId);
              this.formHead.setValue(sundryType.name);
              this.formHasTax.setValue(sundryType.hasTax);
              this.formHasVoucherCredit.setValue(sundryType.hasVoucherCredit|| false);
          }
      };
      this.formSundryTypeId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormValueChange);
  }

  // convenience getter for easy access to form fields
  get f() { return this.sundryForm.controls; }
  get formSundryTypeId() { return this.sundryForm.get('sundryTypeId'); }
  get formHasVoucherCredit() { return this.sundryForm.get('hasVoucherCredit'); }
  get formAmount() { return this.sundryForm.get('amount'); }
  get formAccountId() { return this.sundryForm.get('accountId'); }
  get formAccountGroupId() { return this.sundryForm.get('accountGroupId'); }
  get formHead() { return this.sundryForm.get('head'); }
  get formHasTax() { return this.sundryForm.get('hasTax'); }
  get formTaxTypeRateId() { return this.sundryForm.get('taxTypeRateId'); }

  get formId(){ return this.sundryForm.get('id'); }
  updateSundryTypeChange(id){ this.formSundryTypeId.setValue(id); }

    sundryDetailFormGroup(data) {
        return this.fb.group({
            id: [data.id],
            amount: [data.amount],
            description: [data.description],
            accountId: [data.accountId],
            accountGroupId: [data.accountGroupId],
            accountTransactionId: [data.accountTransactionId],
            salesVoucherId: [data.salesVoucherId],
            rate: [data.rate],
            head: [ data.head],
            hasTax: [data.hasTax],
            taxTypeRateId: [data.taxTypeRateId],
            sundryTypeId: [data.sundryTypeId ],
            hasVoucherCredit: [data.hasVoucherCredit ],
            systemType: [data.systemType ],
        });
    }

  get formSaleVoucherDetail() { return <FormArray>this.customForm.get('saleVoucherDetail');  }
  get formSundryDetail() { return <FormArray>this.customForm.get('sundryDetail'); }

    onSundryAmountChange(){
        const voucherTotal = (this.formSaleVoucherDetail.value || []).reduce((prev, curr) => {
            prev += parseFloat(curr.netAmount);
            return prev;
        }, 0);

        const sumVal = (this.formSundryDetail.value || []).reduce((prev, curr) => {
            if(!curr.accountTransactionId){
                if(!curr.hasVoucherCredit){
                    prev -= parseFloat(curr.amount);
                } else {
                    prev += parseFloat(curr.amount);
                }
            }
            return prev;
        }, voucherTotal);

        const wholeVal: any = Math.round(sumVal);
        const roundOffValue: any = wholeVal - sumVal;

        const _roundOff = (roundOffValue > 0) ? this.roundOffType.positive : (roundOffValue < 0) ? this.roundOffType.negative : '';

        if (_roundOff) {
            const sundryType: VoucherSundryType = this.lookup.getSundryTypeIdBasedOnName(_roundOff);

            const hasSundryType = (this.formSundryDetail.controls || []).find(r => r.value.id === sundryType.id);

            if (!hasSundryType) {
                const roundOffForm = this.sundryDetailFormGroup({
                    amount: Math.abs(roundOffValue).toFixed(2),
                    description: sundryType.name,
                    sundryTypeId: sundryType.id,

                    accountId: sundryType.accountId,
                    accountGroupId: sundryType.accountGroupId,
                    hasTax: sundryType.hasTax,
                    //taxTypeRateId: sundryType.taxTypeRateId,
                    //sundryTypeId: sundryType.sundryTypeId,
                    hasVoucherCredit: sundryType.hasVoucherCredit || false
                });
                roundOffForm.disable();
                this.formSundryDetail.push(roundOffForm);
            }
        }
        this.cb.emit(null);
    }

    clearRoundOff(){
        const posRoundOffItem: VoucherSundryType = this.lookup.getSundryTypeIdBasedOnName(this.roundOffType.positive);
        const negRoundOffItem: VoucherSundryType = this.lookup.getSundryTypeIdBasedOnName(this.roundOffType.negative);

        const condition = r => (r.sundryTypeId != posRoundOffItem.id && r.sundryTypeId != negRoundOffItem.id && r.amount> 0 && r.sundryTypeId);
        //const formRows: any = (this.formSundryDetail.controls || []).filter(condition);

        const formRows: any = (this.formSundryDetail.value || []).filter(condition);

        //this.formSundryDetail.reset();

        this.formSundryDetail.controls.length = 0;
        (formRows || []).map(r=> {
            this.formSundryDetail.push(this.sundryDetailFormGroup(r));
        });

        //this.formSundryDetail.controls = formRows;
        this.formSundryDetail.push(this.sundryDetailFormGroup({ amount: 0}));
    }
}
