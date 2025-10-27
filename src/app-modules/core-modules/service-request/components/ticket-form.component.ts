import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceRequestAPIResolver} from "../services/api.resolver";
import {SupportTicketService} from "../services/support-ticket.service";

@Component({
  standalone: false,
  selector: 'ticket-form',
  templateUrl: './templates/ticket-form.html',
  styles: [`:host{ display: contents; }`]
})
export class TicketFormComponent implements OnInit{
  customForm: FormGroup;
  formDisabled: boolean = true;
  actionType: any = null;

  @Input() submitted: boolean = false;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  constructor(public fb: FormBuilder,
              public apiResolver: ServiceRequestAPIResolver,
              public service: SupportTicketService) {
    this.customForm = this.fb.group({
      userTypeId: [null],
      userId: [null, Validators.required],
      emailId: [null],
      phoneNumber: [null],
      supportTypeId: [null, Validators.required],
      mediaTypeId: [null, Validators.required],
      header: [null, Validators.required],
      message: [null, Validators.required],
      attachedDocumentId: [null],
      ip: [null],
      pageURL: [null],
      supportTime: [null],
    });

    /*const { id, userTypeId, email, phoneNumber } = apiResolver.getCurrentUser();
    this.customForm.get('userTypeId').setValue(userTypeId);
    this.customForm.get('userId').setValue(id);
    this.customForm.get('emailId').setValue(email);
    this.customForm.get('phoneNumber').setValue(phoneNumber);*/
  }

  get formSupportType() { return <FormArray>this.customForm.get('supportTypeId'); }
  get formMediaType() { return <FormArray>this.customForm.get('mediaTypeId'); }
  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  updateSupportType(val) { this.formSupportType.setValue(val); }

  updateMediaType(val) { this.formMediaType.setValue(val); }

  ngOnInit(){
    this.actionType = this.apiResolver.actionType.create;
    const mediaType: any = this.apiResolver.masterType?.getInboxMediaType();
    this.formMediaType.setValue(mediaType?.id);
  }

  onSubmit(formData){
    // stop here if form is invalid
    if (this.customForm.invalid || this.submitted) {
      return;
    }
      this.submitted = true;
      const data = formData.getRawValue();

      const success = (resp: any)=> {
          this.submitted = false;
          this.onOk.emit(true);
      };

      const failure = (err)=> {
          this.submitted = false;
          this.onOk.emit(false);
      };
      this.service.saveSupportTicket(data).subscribe(success, failure);
  }
}
