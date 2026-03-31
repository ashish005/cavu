import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {FeeTypeForm} from "../forms/fee-type.form";
import {FeePlanLookupService} from "../services/api.resolver";
import {FeeType} from "../domains/fee-type.serializer";
import {FeeTypeService} from "../services/fee-type.service";
import {ACTION_ENUM} from "@app-global";

@Component({
  standalone: false,
    selector: 'fee-type-ce-form',
    templateUrl: './templates/fee-type-ce-form.html',
    styles: [`:host{ display: contents; }`]
})
export class FeeTypeCeFormComponent extends FeeTypeForm implements OnInit
{
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('frequencyTypeCtrl', { static: true }) public frequencyTypeCtrl;
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() id: any;
    @Input() set data(item: FeeType) {
        this.updateData(item);
    };
  submitted: boolean = false;
  maxSectionCount: number = 0;
  depositDurationTypes: Array<any> = [];

  constructor(public override fb: FormBuilder, public service: FeeTypeService, public lookupService: FeePlanLookupService) {
    super(fb);
  }

  updateData(feeType){
    this.id = feeType.id;
    const { feeTaxes, defaultTaskId, defaultFrequencyTypeId, depositDurationType, defaultDay, defaultMonth } = feeType;

      /*const levelMap = (feeTaxes || []).reduce((acc, cur) => {
          if(!acc[cur.studyLevelTypeId]){ acc[cur.studyLevelTypeId] = { values: []}; }
          acc[cur.studyLevelTypeId].values.push(cur);
          return acc;
      }, {});

      feeType.feeTaxes = this.populateDefaultTaxes(levelMap);*/
    super.populateData(feeType || {});
    this.frequencyTypeCtrl.populateData({
      frequencyTypeId: defaultFrequencyTypeId,
      orgTaskId: defaultTaskId,
      defaultDay: defaultDay,
      defaultMonth: defaultMonth,
      depositDurationType: depositDurationType,
    });
  }
  /*populateDefaultTaxes(feeTaxObj){
      const { studyLevel, studyMode } = this.lookupService.masterType;
      this.maxSectionCount =  (studyLevel.length * studyMode.length);
      const dataTaxes =  [];

      (studyLevel || []).forEach(sl => {
          const levels = feeTaxObj[sl.id]?.values;
          (studyMode || []).forEach(sm => {
              const modeGroup = (levels || []).find(r => r.studyModeTypeId == sm.id);
              dataTaxes.push({
                  studyLevelTypeId: sl.id,
                  studyModeTypeId: sm.id,

                  studyLevelTypeName: sl.name,
                  studyModeTypeName: sm.name,

                  id: modeGroup?.id,
                  name: modeGroup?.name,
                  rate: modeGroup?.rate,
                  taxMapperId: modeGroup?.taxMapperId,
                  status: modeGroup?.status
              });
          });
      });
      return dataTaxes;
  }*/

    frequencyTypeChange(data){
        const { frequencyTypeId, orgTaskId, defaultDay, defaultMonth, depositDurationType} = data;
        this.customForm.get('defaultFrequencyTypeId').setValue(frequencyTypeId, {emitEvent: false});
        this.customForm.get('defaultTaskId').setValue(orgTaskId, {emitEvent: false});
        this.customForm.get('defaultDay').setValue(defaultDay, {emitEvent: false});
        this.customForm.get('defaultMonth').setValue(defaultMonth, {emitEvent: false});
        this.customForm.get('depositDurationType').setValue(depositDurationType, {emitEvent: false});
    }

  ngOnInit(){
      /*const itemFormValueChange = ([prev, next]: [any, any]) =>
      {
          if(prev != next)
          {
              this.frequency = this.lookupService.masterType.getFrequencyById(next);
              this.depositDurationTypes = this.lookupService.depositDurationTypes.filter(r => r.masterType == this.frequency?.masterType);
              if(this.depositDurationTypes?.length){
                  this.updateDepositDurationType(this.depositDurationTypes[0]);
              } else {this.updateDepositDurationType({});}
          }
      };
      this.formDefaultFrequencyTypeId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormValueChange);*/
  }

  get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;

    const data = form.getRawValue();
    data.feeTaxes = data.feeTaxes.filter( r => r.taxMapperId);

    if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
      this.service.update(this.id, data).subscribe((resp: any) => {
        this.submitted = false;
        this.onOk.emit(this.id);
      });
    } else if(this.actionType == ACTION_ENUM.ADD) {
      this.service.create(data).subscribe((resp: any) => {
        this.submitted = false;
        this.lookupService.masterType.addFeeType(resp.data);
        this.onOk.emit(resp.data.id);
      });
    }
  }
}
