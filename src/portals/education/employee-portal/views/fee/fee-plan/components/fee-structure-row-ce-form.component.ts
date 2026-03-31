import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {from, of, zip, groupBy, map, mergeMap, reduce, async, concatMap, delay, pairwise, startWith} from "rxjs";
import {FeePlanLookupService} from "../services/api.resolver";

@Component({
    standalone: false,
    selector: '[fee-structure-row-ce]',
    templateUrl: './templates/fee-structure-row-ce.html',
    styles: [`:host{ display: contents; }`]
})
export class FeeStructureRowCeFormComponent implements OnInit {
  @ViewChild('frequencyTypeCtrl', { static: true }) public frequencyTypeCtrl;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() onTest: EventEmitter<any> = new EventEmitter<any>();

  @Input() customForm: FormGroup;
  @Input() index: number;

  // get id() { return  this.customForm.get('id').value; };
  constructor(public fb: FormBuilder, public lookupService: FeePlanLookupService) {}
  ngOnInit() {
      const { frequencyTypeId, orgTaskId, defaultDay, defaultMonth, depositDurationType} = this.customForm.getRawValue();
      this.frequencyTypeCtrl.populateData({
          frequencyTypeId: frequencyTypeId,
          orgTaskId: orgTaskId,
          defaultDay: defaultDay,
          defaultMonth: defaultMonth,
          depositDurationType: depositDurationType,
      });

      const amountChange = ([prev, next]: [any, any]) =>
      {
          if(prev != next) {
              const rate = this.customForm.get('rate').value;
              let amount: number = parseFloat(<any>next);
              const tax: any = (rate * amount) / 100;
              const totalAmount: any = parseFloat(<any>amount) + tax;

              this.customForm.get('taxAmount').setValue(tax.toFixed(2));
              this.customForm.get('totalAmount').setValue(totalAmount);
          }
      };
      this.customForm.get('amount').valueChanges.pipe(startWith(null as string), pairwise()).subscribe(amountChange);
  }
    deleteRow(){ this.onDelete.emit(this.index); }

    frequencyTypeChange(data){
        const { frequencyTypeId, defaultDay, defaultMonth, depositDurationType} = data;
        this.customForm.get('frequencyTypeId').setValue(frequencyTypeId, {emitEvent: false});
        //this.customForm.get('orgTaskId').setValue(orgTaskId, {emitEvent: false});
        this.customForm.get('defaultDay').setValue(defaultDay, {emitEvent: false});
        this.customForm.get('defaultMonth').setValue(defaultMonth, {emitEvent: false});
        this.customForm.get('depositDurationType').setValue(depositDurationType, {emitEvent: false});
    }

    planStructureTest(){
      let data = this.customForm.getRawValue();
        data.frequencyMasterType = this.frequencyTypeCtrl.frequency.masterType;
        this.onTest.emit(data);
    }
    // feeTypeChangeImpactDialogue(accept, refused){
    //   const message = `Tax implication in Fee Structure will Change Automatically. Do you want to update student's existing fee record of current session`;
    //   this.coreService.alertService.showDialog(message, DialogType.confirm, accept, refused);
    // }
    //   this.feeTypeChangeImpactDialogue((data)=>{
    //     this.formTaxMapperId.setValue(taxMapperId);
    //     this.formTaxCategoryId.setValue(taxCategory.id);
    //     this.applyRateChanges(this.amount, this.feeTypeId, studyLevelId, studyModeId, taxMapperId, taxCategory.id);
    //     this.service.updateDueFeeStructure(this.feeTypeId, 0, this.formFeeStructureId.value).subscribe(r => {}, err=> {})
    //   }, (e)=> {
    //     this.formTaxMapperId.setValue(this.formTaxMapperId.parent.value.taxCategoryId);
    //     this.formTaxCategoryId.setValue(this.formTaxMapperId.parent.value.taxMapperId);
    //   });
    // }
}
