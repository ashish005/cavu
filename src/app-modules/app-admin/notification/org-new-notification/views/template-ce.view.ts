import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {CommGateway, MediaTypeLookup} from "../domains/lookup.serializer";
import {TemplateForm} from "../forms/template-ce.form";
import {ActivatedRoute} from "@angular/router";
import {ACTION_ENUM} from "@app-global";
import {NotificationAPIResolver} from "../services/api.resolver";
import {NotificationMediaTypeTemplate, OrgNotification} from "../domains/notification.serializer";
import {NotificationTemplate} from "../domains/template.serializer";
import {NotificationTemplateService} from "../services/template.service";

@Component({
  templateUrl: './templates/template-ce.html',
  styles:[`:host { display: contents; }`]
})
export class TemplateCeView extends TemplateForm implements OnInit {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  gateways: Array<CommGateway>;
  mediaType: MediaTypeLookup;
  isLoading: boolean;
  notification: OrgNotification;
  get actionType(){ return (this.formId.value) ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; }
  constructor(public fb: FormBuilder, public activatedRoute: ActivatedRoute,
              public service: NotificationTemplateService,
              public apiResolver: NotificationAPIResolver) {
      super(fb);
  }

  ngOnInit() {
      const { routeConfig, data } = this.activatedRoute.snapshot;
      this.notification = data.notification.data;
      this.mediaType = this.apiResolver.masterType.getMediaTypeByMaster(routeConfig.path);

      const template: NotificationMediaTypeTemplate = this.notification.templates?.find(r => r.mediaTypeId == this.mediaType.id);
      const {
          masterType, mediaTypeId,
          templateId, header, templateCode, content, orgTaskScheduleId,
          isDefaultFooter,gatewayId, isTaskReminder, status
      } = template;
      super.populateForm(new NotificationTemplate({
          templateId: templateId,
          mediaTypeId: mediaTypeId,
          mediaMasterType: masterType,
          header: header,
          templateCode: templateCode,
          content: content,

          orgTaskScheduleId: orgTaskScheduleId,
          isDefaultFooter: isDefaultFooter,
          gatewayId: gatewayId,
          isTaskReminder: isTaskReminder,
          notificationId: this.notification.id,
          status: true
      }));
      this.customForm.get('mediaMasterType').setValue(masterType);
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
