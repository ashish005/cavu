import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {pairwise, startWith} from "rxjs";
import {ACTION_ENUM} from "@app-global";
import {CommGateway, MediaTypeLookup} from "../domains/lookup.serializer";
import {OrgNotificationAPIResolver} from "../services/api.resolver";
import {NotificationService, NotificationTemplateService} from "../services/notification.service";
import {TemplateForm} from "../forms/template-ce.form";
import {NotificationMediaTypeTemplate, OrgNotification} from "../domains/notification.serializer";
import {NotificationTemplate} from "../domains/notification-template.serializer";

@Component({
    standalone: false,
  templateUrl: './templates/template-ce.html',
  providers: [NotificationTemplateService],
  styles:[`:host { display: contents; }`]
})
export class NotificationTemplateCeComponent extends TemplateForm implements OnInit {
  @Input() id: any;
  @Input() data : { mediaMasterType: any, notificationId: any };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  submitted: boolean = false;
  @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;

  gateways: Array<CommGateway>;
  mediaType: MediaTypeLookup;
  isLoading: boolean;
  notification: OrgNotification;
  get actionType(){ return (this.id) ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; }
  constructor(public override fb: FormBuilder,
              public notificationService: NotificationService,
              public service: NotificationTemplateService,
              public apiResolver: OrgNotificationAPIResolver) { super(fb);
      const mediaTypeChanges = ([prev, next]: [any, any]) =>
      {
          if(prev != next)
          {
              this.mediaType = this.apiResolver.masterType.getMediaTypeByMaster(next);
              this.gateways = this.apiResolver.masterType.gatewayByMediaType(next);

              const template: NotificationMediaTypeTemplate = this.notification.templates?.find(r => r.mediaTypeId == this.mediaType.id);
              const {
                  id, name, masterType, sortOrder, mediaTypeId,
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
          } else {
              this.mediaType = this.apiResolver.masterType.getDefaultMediaType();
          }
      };
      this.formMediaType.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(mediaTypeChanges);
  }

  async ngOnInit() {
      const info = await this.notificationService.read(this.id).toPromise();
      this.notification = info?.data;
      this.formMediaType.setValue(this.data?.mediaMasterType, { emitEvent: true });
  }

    changeMediaType(mediaType){ this.formMediaType.setValue(mediaType.masterType); }

  //changeGateway(e){ this.updateCommGatewayId(e.target.value); }

    onSubmit(_form) {
        // stop here if form is invalid
        if (_form.invalid) {
            return;
        }
        const formRaw = _form.getRawValue();

        const success = (resp: any) => {
            this.isLoading = false;
            this.onOk.emit(true);
        };
        const failure = (err: any) => { this.isLoading = false; };
        this.isLoading = true;
        if (this.id) {
            this.service.update(<any>this.id, formRaw).subscribe(success, failure);
        } else {
            this.service.create(formRaw).subscribe(success, failure);
        }
    }
}
