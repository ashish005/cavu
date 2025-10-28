// import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
// import {FormBuilder, FormGroup, Validators} from "@angular/forms";
// import {NotificationReminderForm} from "../forms/notification-reminder.form";
// import {NotificationReminderService} from "../services/notification-reminder.service";
// import {NotificationAPIResolver} from "../services/api.resolver";
//
// @Component({
//   standalone: false,
//   templateUrl: './templates/notification-reminder.html',
//   styles: [`:host{ display: contents; }`]
// })
// export class NotificationReminderView  extends NotificationReminderForm implements OnInit {
//   @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
//   @Input() userMasterType: string;
//   @Input() id: number;
//   @Input() orgTaskId: number;
//   @Input() set data(val){ this.populateForm(val); };
//
//   submitted: boolean = false;
//   isLoading: boolean = false;
//
//   tabs: any = {
//     'reminder': 'reminder',
//     'userGroup': 'userGroup'
//   };
//   activeTab: string = this.tabs.reminder;
//   @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
//   @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
//   constructor(public override fb: FormBuilder,
//               private apiResolver: NotificationAPIResolver,
//               private service: NotificationReminderService) {
//     super(fb);
//   }
//
//   ngOnInit() {}
//
//   openTab(tab: string){ this.activeTab = tab; }
//
//   onReminderSubmit(form: FormGroup){
//     // stop here if form is invalid
//     if (form.invalid) {
//       return;
//     }
//     this.submitted = true;
//
//     const performAction = (resp)=> {
//       this.submitted = false;
//       this.onOk.emit(null);
//     };
//
//     const failure = ()=> {
//       this.submitted = false;
//     };
//
//     const formValues = form.getRawValue();
//     formValues.orgTaskId = formValues.orgTaskId || this.orgTaskId;
//     if(this.id) {
//       this.service.update(this.id, formValues).subscribe(performAction, failure);
//     } else {
//       this.service.create(formValues).subscribe(performAction, failure);
//     }
//   }
// }
