import {
    Component, EventEmitter,
    Input,
    OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {OrgInvoiceAPIResolver} from "../../services/api.resolver";
import {OrgInvoiceService} from "../../services/invoice.service";

@Component({
  standalone: false,
    selector: 'voucher-config',
    templateUrl: './templates/voucher-config.html',
    styles:[`:host { display: contents; }`]
})
export class VoucherConfigComponent implements  OnInit{
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    submitted: boolean = false;
    customForm: FormGroup;
    onOk: EventEmitter<any> = new EventEmitter<any>();
    @Input() set vType (val){ this.customForm.patchValue(val); }

    constructor(public fb: FormBuilder, public apiResolver: OrgInvoiceAPIResolver, public service: OrgInvoiceService){
        this.customForm = this.fb.group(<any>{
            name: [null],
            abbreviation: [null],
            isPrimary: [false],
            voucherNoDisplay: [null],
            voucherDateDisplay: [true],
            sortOrder: [false],
            isDefault: [false],
            config: this.fb.group(<any>{
                voucherNoTypeId: [null],
                voucherNoLength: [false],
                voucherNoStartingFrom: [null],
                validFrom: [true],
                prefix: [false],
                isDefault: [false],
                startWithPrefix: [null],
                startWithZero: [null],
                suffix: [null]
            })
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    ngOnInit(){}

    saveForm(form: FormGroup, p){
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            p.close();
            this.onOk.emit({  refresh: true });
        };
        const error = (resp)=> {
            this.submitted = false;
        };
        this.submitted = true;
        this.service.voucherConfig(this.apiResolver.vType.id, form.value).subscribe(success, error);
    }
}
