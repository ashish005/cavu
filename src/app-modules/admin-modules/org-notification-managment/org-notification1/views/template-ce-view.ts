import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {CommGateway, MediaTypeLookup} from "../domains/lookup.serializer";
import {NotificationTemplateService} from "../services/notification.service";
import {TemplateForm} from "../forms/template-ce.form";
import {ActivatedRoute} from "@angular/router";
import {ACTION_ENUM} from "@app-global";
import {OrgNotificationAPIResolver} from "../services/api.resolver";
import {NotificationMediaTypeTemplate, OrgNotification} from "../domains/notification.serializer";
import {NotificationTemplate} from "../domains/notification-template.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/template-ce-view.html',
  providers: [NotificationTemplateService],
  styles:[`:host { display: contents; }`]
})
export class TemplateCeView extends TemplateForm implements OnInit {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  gateways: Array<CommGateway>;
  mediaType: MediaTypeLookup;
  isLoading: boolean;
  notification: OrgNotification;
  routeConfig: any;
    submitted: false;
  get actionType(){ return (this.formId.value) ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; }
  constructor(public override fb: FormBuilder, public activatedRoute: ActivatedRoute,
              public service: NotificationTemplateService,
              public apiResolver: OrgNotificationAPIResolver) {
      super(fb);
  }

  ngOnInit() {
      const { routeConfig, data: { notification } } = this.activatedRoute.snapshot;
      this.notification = notification.data;
      this.routeConfig = routeConfig;
      //OrgNotification
      this.mediaType = this.apiResolver.masterType.getMediaTypeByMaster(routeConfig.path);

      if(this.mediaType) {
          const template: NotificationMediaTypeTemplate = this.notification.templates?.find(r => r.mediaTypeId == this.mediaType.id);
          const {
              masterType, mediaTypeId,
              templateId, header, templateCode, content, orgTaskScheduleId,
              isDefaultFooter,gatewayId, isTaskReminder, notificationId
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
              notificationId: notificationId
          }));
          this.customForm.get('mediaMasterType').setValue(masterType);
      }
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
