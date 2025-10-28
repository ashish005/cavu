import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {TemplateForm} from "../forms/template-ce.form";
import {ActivatedRoute} from "@angular/router";
import {ACTION_ENUM} from "@app-global";
import {NotificationAPIResolver} from "../services/api.resolver";
import {OrgNotification} from "../domains/notification.serializer";
import {NotificationTemplateService} from "../services/template.service";

@Component({
  standalone: false,
  templateUrl: './templates/notification-setting-ce.html',
  styles:[`:host { display: contents; }`]
})
export class NotificationSettingCeView extends TemplateForm implements OnInit {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  isLoading: boolean;
  notification: OrgNotification;
  get actionType(){ return (this.formId.value) ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; }
  constructor(public override fb: FormBuilder, public activatedRoute: ActivatedRoute,
              public service: NotificationTemplateService,
              public apiResolver: NotificationAPIResolver) {
      super(fb);
  }

  ngOnInit() {
      const { notification: { data} } = this.activatedRoute.snapshot.data;
      this.notification = data;
  }

    showScheduler = (row: OrgNotification) => this.apiResolver.showSchedulerPopup(row, (orgTaskScheduleId) => {
        //row.orgTaskScheduleId = orgTaskScheduleId;
    });

    checkActivity(data: OrgNotification) {
        const { schedulerConfig, name } = data;
        const { orgTaskId, orgTaskScheduleId, isManual } = schedulerConfig;
        const popupHeaderOption = { text: `Activity for ${name}`, desc: `Activity` };
        const inputData: any = { orgTaskId: orgTaskId, scheduleId: orgTaskScheduleId };
        this.apiResolver.showEventTaskActivityPopup(inputData, popupHeaderOption);
    }

  //changeGateway(e){ this.updateCommGatewayId(e.target.value); }

    onSubmit(_form) {
        // stop here if form is invalid
        if (_form.invalid) {
            return;
        }
        const formRaw = _form.getRawValue();

        const success = (resp: any) => { this.isLoading = false; };
        const failure = (err: any) => { this.isLoading = false; };
        this.isLoading = true;
        if (formRaw.id) {
            this.service.update(formRaw.id, formRaw).subscribe(success, failure);
        } else {
            this.service.create(formRaw).subscribe(success, failure);
        }
    }
}
