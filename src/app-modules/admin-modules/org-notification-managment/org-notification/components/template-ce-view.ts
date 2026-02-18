import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {pairwise, startWith} from "rxjs";
import {ACTION_ENUM} from "@app-global";
import {NotificationTemplate} from "../domains/notification-template.serializer";
import {CommGateway, MediaTypeLookup} from "../domains/lookup.serializer";
import {NotificationAPIResolver} from "../services/api.resolver";
import {NotificationTemplateService} from "../services/notification.service";
import {TemplateForm} from "../forms/template-ce.form";

@Component({
    standalone: false,
  templateUrl: './templates/template-ce-view.html',
  providers: [NotificationTemplateService],
  styles:[`:host { display: contents; }`]
})
export class TemplateCeView extends TemplateForm implements OnInit {
  @Input() id: number;
  @Input() set data(val: NotificationTemplate) { this.populateForm(val); }
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  gateways: Array<CommGateway>;
  mediaType: MediaTypeLookup;
  isLoading: boolean;
  submitted: boolean = false;
  get actionType(){ return (this.id) ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; }
  constructor(public override fb: FormBuilder,
              public service: NotificationTemplateService,
              public apiResolver: NotificationAPIResolver) { super(fb);
      const mediaTypeChanges = ([prev, next]: [any, any]) =>
      {
          if(prev != next)
          {
              this.mediaType = this.apiResolver.masterType.getMediaTypeById(next);
              this.gateways = this.apiResolver.masterType.gatewayByMediaType(next);
              this.customForm.get('mediaTypeId').setValue(next, { emitEvent: false });
              this.customForm.get('mediaMasterType').setValue(this.mediaType?.masterType, { emitEvent: false });
          } else {
              this.mediaType = this.apiResolver.masterType.getDefaultMediaType();
          }
      };
      this.formMediaTypeId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(mediaTypeChanges);
  }

  ngOnInit() {}

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
