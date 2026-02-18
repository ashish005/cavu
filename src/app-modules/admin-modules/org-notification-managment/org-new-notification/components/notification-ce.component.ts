import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import { FormArray, FormBuilder } from "@angular/forms";
import {ACTION_ENUM} from "@app-global";
import {MediaTypeLookup, NotificationTypeLookup} from "../domains/lookup.serializer";
import {NotificationService} from "../services/notification.service";
import {NotificationRuleForm} from "../forms/notification-rule.form";
import {pairwise, startWith} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {NotificationAPIResolver} from "../services/api.resolver";

@Component({
  standalone: false,
  templateUrl: './templates/notification-ce.html',
  styles: [ `:host { display: contents;}`]
})
export class NotificationCeComponent extends NotificationRuleForm implements OnInit {
  @Input() id: any;
  @Input() set data(info) { this.populateForm(info); }
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  get actionType(){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; }
  submitted: boolean = false;
  notificationTypes: Array<NotificationTypeLookup> = [];
  notificationType: NotificationTypeLookup;
  lookupEvents: Array<any>;
  options: any = { showClear: false };
  eventOptions: any = { title: 'Event', label: 'name', key: 'appEvent', listKey: 'masterType' };
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  constructor(public override fb: FormBuilder, public activatedRoute: ActivatedRoute,
              public service: NotificationService, public lookupResolver: NotificationAPIResolver) {
    super(fb);
      const itemFormValueChange = ([prev, next]: [any, any]) =>
      {
          const notificationTypes = this.lookupResolver.masterType.getNotificationTypeLookups();
          if(prev != next) {
              this.notificationType = (notificationTypes || []).find(r => r.id == next);
              if(this.id) {
                  this.formNotificationTypeId.disable();
                  return;
              }
              const { userRoles, mediaTypes } = this.lookupResolver.masterType;

              this.formPermissions.controls.length = 0;
              this.formTemplates.controls.length = 0;

              if(this.notificationType) {
                  const { id, userTypeId } = this.notificationType;

                  const permissions = (id && userTypeId) ? (userRoles || []).filter(r => r.userTypeId == userTypeId): userRoles;
                  (permissions || []).map(r => { this.addToFormRule(<any>{ userRoleId: r.id, userRoleName: r.name, isEnable: false }); });
                  (mediaTypes || []).map(r => { this.addToTemplateTypeFormRule(<any>{ name: r.name, masterType: r.masterType, sortOrder: r.sortOrder }); });

                  if(userTypeId) {
                      this.notificationTypes = (notificationTypes || []).filter(r => r.userTypeId == userTypeId);
                  } else {
                      this.notificationTypes = (notificationTypes || []);
                  }
              } else {
                  this.notificationTypes = (notificationTypes || []);
              }
          } else {
              this.notificationTypes = (notificationTypes || []);
          }
      };
      this.formNotificationTypeId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormValueChange);
  }

  ngOnInit(){
      this.lookupEvents = this.lookupResolver.masterType.orgNotifyEvents;
  }

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    const formData = form.getRawValue();

      const success=(resp: any)=>{
          this.submitted = false;
          this.onOk.emit(true);
      };
      const failure=(resp: any)=>{
          this.submitted = false;
      };

      if(this.id) {
          this.service.update(this.id, formData).subscribe(success, failure);
      } else {
          this.service.create(formData).subscribe(success, failure);
      }
  }
}
