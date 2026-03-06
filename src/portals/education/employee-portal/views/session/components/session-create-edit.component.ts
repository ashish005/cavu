import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ACTION_ENUM, SharedService} from "@app-global";
import {OrgSession} from "../domains/session.serializer";
import {OrgSessionService} from "../services/org-session.service";
import {SessionAPIResolver} from "../services/api.resolver";

@Component({
  standalone: false,
  selector: 'org-session-create-edit',
  templateUrl: './templates/session-create-edit.html',
  styles: [`:host { display: contents; }`]
})
export class SessionCreateEditComponent implements OnInit{
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() id: string;

  @Input() set data(dataValue: OrgSession) {
    this.populateData(dataValue || <OrgSession>{});
  };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  submitted: boolean;

  customForm: FormGroup;
  get actionType(){ return (this.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD};
  constructor(public fb: FormBuilder, public apiResolver: SessionAPIResolver, public service: OrgSessionService) {
      this.customForm = this.fb.group({
          name: ['', Validators.required],
          startDate: [null, Validators.required],
          endDate: [null, Validators.required]
      });
  }

  get f() { return this.customForm.controls; }
  get formStartDate() { return this.customForm.get('startDate'); }
  get formEndDate() { return this.customForm.get('endDate'); }

  ngOnInit(): void { }

  populateData(data) {
    const { name, startDate, endDate } = data;
    this.customForm.get('name').setValue(name);
    this.customForm.get('startDate').setValue(startDate);
    this.customForm.get('endDate').setValue(endDate);
  }

  // populateData(data){
  //   this.updateFormName(data.name);
  //   const startDate = UtilHelper.toDateControlFormat(data.startDate);
  //   this.customForm.get('startDate').setValue(startDate);
  //
  //   const dateYear = startDate.split('-')[0];
  //   const fromYear = data.fromYear || dateYear;
  //   this.updateFromYear(`${fromYear}`);
  //
  //   const toYear = data.toYear || (dateYear+1);
  //   this.updateSpecifics(+fromYear);
  // }
  //
  // updateSpecifics(fromYear: number){
  //   this.yearList = [];
  //   for(let i = 1; i>=0; i--){
  //     const modl = {
  //       name: `${fromYear + i}`
  //     };
  //     this.yearList.push(modl);
  //   }
  //
  //   const toYear = this.yearList[0].name || '';
  //   this.minDate = `${fromYear}-01-01`;
  //   this.maxDate = `${fromYear}-12-31`;
  //   this.updateToYear(`${toYear}`);
  // }

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    const data = form.getRawValue();

    const success = (resp)=>{
      this.submitted = false;
      this.onOk.emit(resp);
    };

    const failure = (resp)=>{
      this.submitted = false;
    };

    if(this.id) {
      this.service.update(this.id, data).subscribe(success, failure);
    } else {
      this.service.create(data).subscribe(success, failure);
    }
  }
}
