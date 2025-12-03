import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Directive,
  TemplateRef,
  ViewChild, AfterViewInit
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ACTION_ENUM} from "@app-global";
import {ComplianceForm} from "../forms/compliance.form";
import {Compliance} from "../domains/compliance.serializer";
import { ComplianceAPIResolver, ComplianceService } from "../services";
import {pairwise, startWith} from "rxjs";
import {ComplianceLookup} from "../domains/compliance.lookup";

@Component({
  standalone: false,
  templateUrl: './templates/compliance-ce.html',
  styles: [`:host{ display: contents; }`]
})
export class ComplianceCeComponent extends ComplianceForm implements OnInit {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() id: any;
  @Input() set data(item: Compliance) {
    super.mergeUpdate(item || new Compliance());
  };

  submitted: boolean = false;
  get actionType(){ return this.id ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  subscriptions = [];
  lookup: ComplianceLookup;
  constructor(public override fb: FormBuilder, private service: ComplianceService, public apiResolver: ComplianceAPIResolver) {
    super(fb);
    this.lookup = apiResolver.masterType;
    const ComplianceTypeValueChange = ([prev, next]: [any, any]) =>
    {
        if(prev != next)
        {
            this.subscriptions = this.lookup.getSubscriptionsByComplianceType(next);
        }
    };

    this.formComplianceTypeId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(ComplianceTypeValueChange);
  }

  ngOnInit(): void { }

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;

    if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
      this.service.update(this.id, form.value).subscribe((resp: any) => {
        this.submitted = false;
        this.onOk.emit(true);
      });
    } else if(this.actionType == ACTION_ENUM.ADD) {
      this.service.create(form.value).subscribe((resp: any) => {
        this.submitted = false;
        this.onOk.emit(true);
      });
    }
  }
}
