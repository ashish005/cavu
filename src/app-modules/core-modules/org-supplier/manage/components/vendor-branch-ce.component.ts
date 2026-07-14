import {Component, Directive, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {VendorLookupResolver} from "../services/api.resolver";
import {VendorBranch} from "../domains/vendor-branch.serializer";
import {SupplierByBranchManagementService} from "../services/supplier-by-branch-management.service";
import {Vendor} from "../domains/vendor.serializer";
import {CommonModule} from "@angular/common";

@Directive()
class VendorBranchForm
{
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            fName: [null, Validators.required],
            lName: [null],
            email: [null, Validators.required],
            phoneNo: [null, Validators.required],

            name: [null, Validators.required],
            isRegistered: [true],
            taxNo: [null],
            registrationNo: [null],
            registrationDate: [null],
            supplyTypeId: [null],
            natureId: [null],
            purchaseTypeId: [null],
            hasTaxByItem: [null],
            hasItemInclTax: [null],
            hasItemInclDiscount: [null],
            amountCalcTypeId: [null],
            costCalcTypeId: [null],

            code: [null],
            contactNo: [null],
            contactEmail: [null],
            address: [null, Validators.required],
            city: [null],
            pinCode: [null],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populateBranch(item: VendorBranch){
        const {
            fName, lName, email, phoneNo,
            name, code, contactNo, contactEmail,
            address, city, pinCode,
            vendor
        } = item || <VendorBranch>{};

        const { taxNo, isRegistered, registrationNo, registrationDate, supplyTypeId, natureId, purchaseTypeId, hasTaxByItem, hasItemInclTax, hasItemInclDiscount, amountCalcTypeId, costCalcTypeId } = vendor || <Vendor>{};

        this.customForm.get('fName').setValue(fName);
        this.customForm.get('lName').setValue(lName);
        this.customForm.get('email').setValue(email);
        this.customForm.get('phoneNo').setValue(phoneNo);

        this.customForm.get('name').setValue(name);
        this.customForm.get('code').setValue(code);
        this.customForm.get('contactNo').setValue(contactNo);
        this.customForm.get('contactEmail').setValue(contactEmail);
        this.customForm.get('address').setValue(address);
        this.customForm.get('city').setValue(city);
        this.customForm.get('pinCode').setValue(pinCode);

        this.customForm.get('taxNo').setValue(taxNo);
        this.customForm.get('isRegistered').setValue(isRegistered);
        this.customForm.get('registrationNo').setValue(registrationNo);
        this.customForm.get('registrationDate').setValue(registrationDate);
        this.customForm.get('supplyTypeId').setValue(supplyTypeId);
        this.customForm.get('natureId').setValue(natureId);
        this.customForm.get('purchaseTypeId').setValue(purchaseTypeId);
        this.customForm.get('hasTaxByItem').setValue(hasTaxByItem);
        this.customForm.get('hasItemInclTax').setValue(hasItemInclTax);
        this.customForm.get('hasItemInclDiscount').setValue(hasItemInclDiscount);
        this.customForm.get('amountCalcTypeId').setValue(amountCalcTypeId);
        this.customForm.get('costCalcTypeId').setValue(costCalcTypeId);
    }

    get formSupplyTypeId() { return <FormGroup>this.customForm.get('supplyTypeId'); }
    get formNatureId() { return <FormGroup>this.customForm.get('natureId'); }
    get formPurchaseTypeId() { return <FormGroup>this.customForm.get('purchaseTypeId'); }
    get formAmountCalcTypeId() { return <FormGroup>this.customForm.get('amountCalcTypeId'); }
    get formCostCalcTypeId() { return <FormGroup>this.customForm.get('costCalcTypeId'); }

    updateSupplyTypeId(val){ this.formSupplyTypeId.setValue(val); }
    updateNatureId(val){ this.formNatureId.setValue(val); }
    updatePurchaseTypeId(val){ this.formPurchaseTypeId.setValue(val); }
    updateAmountCalcTypeId(val){ this.formAmountCalcTypeId.setValue(val); }
    updateCostCalcTypeId(val){ this.formCostCalcTypeId.setValue(val); }
}

@Component({
    selector: 'vendor-branch-ce',
    templateUrl: `./templates/vendor-branch-ce.html`,
    styles: [`:host { display: contents;}`],
    standalone: false
})
export class VendorBranchCEComponent extends VendorBranchForm {
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() vendorId: string;
    @Input() accountId: string;
    @Input() set data(item: VendorBranch) { super.populateBranch(item); };
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    //supplyNature: SupplyNatureLookup;
    constructor(public override fb: FormBuilder, public apiResolver: VendorLookupResolver, private service: SupplierByBranchManagementService) {
        super(fb);
        // const itemFormSupplyNatureChange = ([prev, next]: [any, any]) =>
        // {
        //     if(prev != next)
        //     {
        //         this.supplyNature = this.apiResolver.masterType?.getNatureById(next);
        //     }
        // };
        // this.formNatureId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormSupplyNatureChange);
    }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) { return; }
        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit({ refresh: true });
        };

        const error = (resp)=> {
            this.submitted = false;
        };

        const data = form.getRawValue();
        data.vendorId = this.vendorId;
        data.accountId = this.accountId;
        this.submitted = true;
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, data).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(data).subscribe(success, error);
        }
    }
}
