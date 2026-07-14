import {Component, Directive, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {VendorExecutive} from "../domains/vendor-executive.serializer";
import {VendorByIdAPIResolver} from "../services/api.resolver";
import {SupplierExecutiveService} from "../services/supplier-executive.service";

@Directive()
class VendorExecutiveForm
{
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            fName: [null, Validators.required],
            lName: [null],
            email: [null, Validators.required],
            phoneNo: [null],
            branchId: [null],
            accountId: [null]
        });
    }

    get f() { return this.customForm.controls; }
    populateData(item: any){ this.customForm.patchValue(<any>item);}
}

@Component({
    templateUrl: `./templates/vendor-executive-ce.html`,
    styles: [`:host { display: contents;}`],
  standalone: false
})
export class VendorExecutiveCEComponent extends VendorExecutiveForm {
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() branchId: string;
    @Input() accountId: string;
    @Input() set data(item: VendorExecutive) { super.populateData(item); };

    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public override fb: FormBuilder, public apiResolver: VendorByIdAPIResolver, private service: SupplierExecutiveService) {
        super(fb);
    }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit({ refresh: true });
        };
        const error = (resp)=> {
            this.submitted = false;
        };
        this.submitted = true;

        const data = form.getRawValue();
        data.branchId = this.branchId;
        data.accountId = this.accountId;
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, data).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(data).subscribe(success, error);
        }
    }
}
