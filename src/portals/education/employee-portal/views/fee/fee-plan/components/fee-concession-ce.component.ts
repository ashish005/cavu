import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {FeeConcessionForm} from "../forms/fee-concession.form";
import {FeePlanLookupService} from "../services/api.resolver";
import {FeeConcessionType} from "../domains/fee-concession.serializer";
import {ACTION_ENUM, CalculationTypes} from "@app-global";
import {FeeConcessionTypeService} from "../services/fee-concession.service";

@Component({
  standalone: false,
  selector: 'fee-concession-ce',
  templateUrl: './templates/fee-concession-ce.html',
  styles: [`:host{ display: contents; }`]
})
export class FeeConcessionCeComponent extends FeeConcessionForm {
  calculationTypes = CalculationTypes;
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  submitted: boolean = false;

  get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
  @Input() set data(item: FeeConcessionType) { this.populateData(item); };
  @Input() id;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  constructor(public override fb: FormBuilder, private service: FeeConcessionTypeService,
              public lookupService: FeePlanLookupService) {
    super(fb);
  }

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    if(this.id) {
      this.service.update(this.id, form.value).subscribe((resp: any) => {
        this.submitted = false;
        this.onOk.emit(true);
      });
    } else {
      this.service.create(form.value).subscribe((resp: any) => {
        this.submitted = false;
        this.onOk.emit(true);
      });
    }
  }
}
