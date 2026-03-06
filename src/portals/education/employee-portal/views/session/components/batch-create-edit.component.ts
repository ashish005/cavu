import {Component, EventEmitter, Input, OnInit, Output, Directive, ViewChild, TemplateRef} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Batch} from "../domains/batch.serializer";
import {ACTION_ENUM} from "@app-global";
import {BatchForm} from "../forms/batch.form";
import {SessionAPIResolver} from "../services/api.resolver";
import {OrgBatchService} from "../services/org-batch.service";

@Component({
  standalone: false,
  selector: 'org-batch-create-edit',
  templateUrl: './templates/batch-create-edit.html',
  styles: [`:host { display: contents; }`]
})
export class OrgBatchCreateEditComponent extends BatchForm {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() id: string;

  @Input() set data(dataValue: Batch) {
    this.populateBatchForm(dataValue || <Batch>{});
  };

  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  submitted: boolean;
  get actionType(){ return (this.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD};
  constructor(public override fb: FormBuilder, public apiResolver: SessionAPIResolver, public service: OrgBatchService) {
    super(fb);
  }

  populateBatchForm(data: Batch){
    const startDate: any = data.startDate;
    this.customForm.get('name').setValue(data.name);
    this.formOrgSession.setValue(data.orgSessionId);
    this.formStartDate.setValue(startDate);
    this.formStudyMode.setValue(data.studyModeTypeId);
  }

  updateStudyMode(val){
    this.formStudyMode.setValue(val);
  }

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;


    const success = (resp)=>{
      this.submitted = false;
      this.onOk.emit(resp);
    };

    const failure = (resp)=>{
      this.submitted = false;
    };

    if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
      this.service.update(this.id, form.value).subscribe(success, failure);
    } else if(this.actionType == ACTION_ENUM.ADD) {
      this.service.create(form.value).subscribe(success, failure);
    }
  }
}
