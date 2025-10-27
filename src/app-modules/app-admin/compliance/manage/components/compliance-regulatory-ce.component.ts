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
import { ComplianceAPIResolver, ComplianceRegulatoryService } from "../services";
import {ComplianceRegulatoryForm} from "../forms/compliance-regulatory.form";
import {ComplianceRegulatory} from "../domains/compliance-regulatory.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/compliance-regulatory-ce.html',
  styles: [`:host{ display: contents; }`]
})
export class ComplianceRegulatoryCeComponent extends ComplianceRegulatoryForm implements OnInit {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    @Input() id: any;

    @Input() set data(item: ComplianceRegulatory) {
        super.populateForm(item);
    };

    submitted: boolean = false;
    get actionType(){ return this.id ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public fb: FormBuilder,
                private service: ComplianceRegulatoryService,
                public apiResolver: ComplianceAPIResolver) { super(fb); }

    ngOnInit(): void {}

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
