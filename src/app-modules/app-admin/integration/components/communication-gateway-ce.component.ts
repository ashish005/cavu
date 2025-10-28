import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, Directive } from "@angular/core";
import {FormArray, FormBuilder} from "@angular/forms";
import {ACTION_ENUM} from "@app-global";
import {CommunicationGatewayForm} from "../forms/communication-gateway.form";
import {CommunicationGateway} from "../domains/communication-gateway.serializer";
import {CommunicationGatewayService} from "../services/communication-gateway.service";

@Component({
  standalone: false,
  templateUrl: './templates/communication-gateway-ce.html',
  styles: [`:host{ display: contents; }`]
})
export class CommunicationGatewayCEComponent extends CommunicationGatewayForm implements OnInit
{
  @Input() set data(item: CommunicationGateway)
  {
    super.populateForm(item || <CommunicationGateway>{});
  };
  submitted: boolean = false;
  get actionType(){ return this.id? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; }
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  constructor(public override fb: FormBuilder,
              public service: CommunicationGatewayService) {
    super(fb);
  }

  ngOnInit(){}

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    const data = form.getRawValue();
    data.status = (data.status) ? 1: 2;

    const success = ()=>{
        this.submitted = false;
        this.onOk.emit(true);
    };
    const failure = ()=>{
        this.submitted = false;
    };

    if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
      this.service.update(this.id, data).subscribe(success, failure);
    } else if(this.actionType == ACTION_ENUM.ADD) {
      this.service.create(data).subscribe(success, failure);
    }
  }
}
