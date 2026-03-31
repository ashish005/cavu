import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {from, of, zip, groupBy, map, mergeMap, reduce, async, concatMap, delay, pairwise, startWith} from "rxjs";
import {FeePlanLookupService} from "../services/api.resolver";

@Component({
    standalone: false,
    selector: '[fee-tax-row-ce]',
    templateUrl: './templates/fee-tax-row-ce.html'
})
export class FeeTaxRowCeFormComponent implements OnInit {
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();

  @Input() customForm: FormGroup;
  @Input() index: number;
  taxTypes: Array<any>;
  constructor(public fb: FormBuilder, public lookupService: FeePlanLookupService) {}
  ngOnInit() {
      const categoryId = this.customForm.get('categoryId').value;
      const { feeTaxTypes, taxCategories } = this.lookupService.masterType;
      if(categoryId > 0){

          const category = (taxCategories || []).find(r => r.id == this.customForm.get('categoryId').value);
          this.taxTypes = (feeTaxTypes || []).filter(r => r.taxGroupId == category.taxGroupId);
      }

      const categoryChange = ([prev, next]: [any, any]) =>
      {
          if(prev != next) {
              //this.customForm.get('categoryId').setValue(next);
              const category = (taxCategories || []).find(r => r.id == next);
              this.taxTypes = (feeTaxTypes || []).filter(r => r.taxGroupId == category.taxGroupId);
          }
      };

      const taxTypeRateChange = ([prev, next]: [any, any]) =>
      {
          if(prev != next) {
              const { feeTaxTypes } = this.lookupService.masterType;
              const taxType = (feeTaxTypes || []).find(r => r.id == next);

              //this.customForm.get('taxTypeRateId').setValue(taxTypeRateId);
              this.customForm.get('hasExtraTaxRate').setValue(taxType.hasExtraTaxRate);
              this.customForm.get('extraTaxRate').setValue(taxType.extraTaxRate);
              this.customForm.get('rate').setValue(taxType.rate);
          }
      };
      this.customForm.get('categoryId').valueChanges.pipe(startWith(null as string), pairwise()).subscribe(categoryChange);
      this.customForm.get('taxTypeRateId').valueChanges.pipe(startWith(null as string), pairwise()).subscribe(taxTypeRateChange);
  }
    deleteRow(){
      this.onDelete.emit(this.index);
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
