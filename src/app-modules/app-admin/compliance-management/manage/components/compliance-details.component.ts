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
import {ACTION_ENUM} from "@app-global";
import { ComplianceAPIResolver, ComplianceService } from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/compliance-details.html',
  styles: [`:host{ display: contents; }`]
})
export class ComplianceDetailsComponent implements OnInit {
  @ViewChild('frequencyTypeCtrl', { static: true }) public frequencyTypeCtrl;
  @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
  @Input() id: any;
  @Input() data: any;
  submitted: boolean = false;
  get actionType(){ return this.id ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  constructor(private service: ComplianceService) {}

  ngOnInit(): void {
    this.frequencyTypeCtrl.applySchedular(this.data);
  }

  onFrequencyChange(data){
    const success = (r)=>{
      debugger
    };
    const failure = (r)=>{};
    this.service.getComplianceSchedules(this.id, data).subscribe(success, failure);
  }
}
