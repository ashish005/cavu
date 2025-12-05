import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from "@angular/core";
import {ACTION_ENUM, GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {ComplianceService} from "../services";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ComplianceDetailService} from "../services/compliance.service";
import {ActivatedRoute} from "@angular/router";
import {ComplianceDetail, ComplianceDetailQueryOptions} from "../domains/compliance-detail.serializer";

class ComplianceDetailForm {
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      details: fb.array([this.complianceDetailFormGroup({})])
    });
  }

  complianceDetailFormGroup(data){
    const { id, dueDate, isActive } = data || {};
    return this.fb.group(<any>{
      id: [id || null],
      dueDate: [dueDate, Validators.required],
      isActive: [isActive]
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }
  get formDetailsRule() { return <FormArray>this.customForm.get('details'); }

  populateDetails(entities: Array<any>) {
    this.formDetailsRule.clear();
    (entities || []).map(r => this.formDetailsRule.push({ dueDate: r.key, isActive: true }));
  }
}

@Component({
  standalone: false,
  selector: 'compliance-schedule-ce',
  templateUrl: './templates/compliance-schedule-ce.html',
  styles: [`:host{ display: contents; }`]
})
export class ComplianceSchedulerComponent implements OnInit {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @ViewChild('frequencyTypeCtrl', { static: true }) public frequencyTypeCtrl;
  @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
  @Input() id: any;
  @Input() schedulerId: any;
  @Input() data: any;
  get actionType(){ return this.schedulerId ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
  submitted: boolean = false;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  constructor(private service: ComplianceService) { }
  schedulerEntities: Array<any>;

  ngOnInit(): void {
    this.frequencyTypeCtrl.applySchedular(this.data || {});
  }

  onFrequencyChange(data){
    const success = (r)=>{
      this.schedulerEntities = r.entities;
    };
    const failure = (r)=>{};
    this.service.testScheduler(data).subscribe(success, failure);
  }

  onSubmit() {
    const form = this.frequencyTypeCtrl.customForm;
    // stop here if form is invalid
    if (!this.id || form.invalid) {
      return;
    }
    this.submitted = true;
    const body = form.getRawValue();
    body.id = this.schedulerId;
    this.service.updateScheduleCompliance(this.id, body).subscribe((resp: any) => {
      this.submitted = false;
      this.onOk.emit(true);
    });
  }
}

@Component({
  standalone: false,
  selector: 'compliance-detail-ce',
  templateUrl: './templates/compliance-detail-ce.html',
  styles: [`:host{ display: contents; }`]
})
export class ComplianceDetailsComponent extends ViewExtender<ComplianceDetail> implements OnInit {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() id: number;
  override coreState: ComplianceDetailQueryOptions = new ComplianceDetailQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute, public override service: ComplianceDetailService){
    super(activatedRoute, service);
    this.gridOptions.header.edit = false;
    this.gridOptions.columnDefs = [
      {headerName: 'Due On', field: 'dueDate' },
      {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
    ];
  }

  ngOnInit() {
    this.coreState.complianceId = this.id;
    super.populateGrid();
  }
  actionCb(e){}
}
