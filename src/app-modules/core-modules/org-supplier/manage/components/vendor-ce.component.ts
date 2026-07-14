import {Vendor} from "../domains/vendor.serializer";
import {VendorLookupResolver} from "../services/api.resolver";
import {Component, Directive, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ACTION_ENUM} from "@app-global";
import {SupplierManagementService} from "../services/supplier-management.service";
import {CommonModule} from "@angular/common";

@Directive()
class VendorForm
{
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            tradeName: [null, Validators.required],
            isRegistered: [true],
            taxNo: [''],
            registrationNo: [''],
            registrationDate: [''],

            supplyTypeId: [null],
            natureId: [null],
            purchaseTypeId: [null],
            hasTaxByItem: [null],
            hasItemInclTax: [null],
            hasItemInclDiscount: [null],

            amountCalcName: [null],
            amountCalcFormula: [null],
            amountCalcTypeId: [null],

            costCalcName: [null],
            costCalcFormula: [null],
            costCalcTypeId: [null],

            fName: [null, Validators.required],
            lName: [null],
            email: [null, Validators.required],
            phoneNo: [null, Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formSupplyTypeId(){ return this.customForm.get('supplyTypeId'); }
    get formSupplyNatureId(){ return this.customForm.get('natureId'); }
    get formPurchaseTypeId(){ return this.customForm.get('purchaseTypeId'); }

    get formAmountCalcTypeId(){ return this.customForm.get('amountCalcTypeId'); }
    get formCostCalcTypeId() { return this.customForm.get('costCalcTypeId') as FormGroup; }

    get formAmountCalcFormula(){ return this.customForm.get('amountCalcName'); }
    get formCostCalcFormula(){ return this.customForm.get('costCalcFormula'); }

    updateSupplyTypeId(val){ this.formSupplyTypeId.setValue(val); }
    updateSupplyNatureId(val){ this.formSupplyNatureId.setValue(val); }
    updatePurchaseTypeId(val){ this.formPurchaseTypeId.setValue(val); }
    updateAmountCalcTypeId(val){ this.formAmountCalcTypeId.setValue(val); }
    updateCostCalcTypeId(val){ this.formCostCalcTypeId.setValue(val); }

    populateVendor(item: Vendor){
        const {
            tradeName, taxNo, isRegistered, registrationNo, registrationDate, supplyTypeId, natureId, purchaseTypeId,
            hasTaxByItem, hasItemInclTax, amountCalcTypeId, costCalcTypeId
        } = item || <Vendor>{};

        this.customForm.get('tradeName').setValue(tradeName);
        this.customForm.get('taxNo').setValue(taxNo);
        this.customForm.get('isRegistered').setValue(isRegistered);
        this.customForm.get('registrationNo').setValue(registrationNo);
        this.customForm.get('registrationDate').setValue(registrationDate);

        this.customForm.get('supplyTypeId').setValue(supplyTypeId);
        this.customForm.get('natureId').setValue(natureId);
        this.customForm.get('purchaseTypeId').setValue(purchaseTypeId);
        this.customForm.get('hasTaxByItem').setValue(hasTaxByItem);
        this.customForm.get('hasItemInclTax').setValue(hasItemInclTax);
        this.customForm.get('amountCalcTypeId').setValue(amountCalcTypeId);
        this.customForm.get('costCalcTypeId').setValue(costCalcTypeId);
    }

    activeAmountCalcType: boolean = true;
    activeCostCalcType: boolean = true;
    toggleNewAmountFormula(){
        this.activeAmountCalcType = !this.activeAmountCalcType;
        if(this.activeAmountCalcType){
            this.formAmountCalcFormula.setValidators([Validators.required]);
            this.formAmountCalcFormula.enable();
            this.formAmountCalcTypeId.disable();
        } else if(!this.activeAmountCalcType){
            this.formAmountCalcFormula.clearValidators();
            this.formAmountCalcFormula.disable();
            this.formAmountCalcTypeId.enable();
        }
    }
    toggleNewCostFormula(){
        this.activeCostCalcType = !this.activeCostCalcType;
        if(this.activeAmountCalcType){
            this.formCostCalcFormula.setValidators([Validators.required]);
            this.formCostCalcFormula.enable();
            this.formCostCalcTypeId.disable();
        } else if(!this.activeAmountCalcType){
            this.formCostCalcFormula.clearValidators();
            this.formCostCalcFormula.disable();
            this.formCostCalcTypeId.enable();
        }
    }
}

@Component({
  selector: 'vendor-ce',
  templateUrl: `./templates/vendor-ce.html`,
  styles: [`:host { display: contents;}`],
  standalone: false
})
export class VendorCEComponent extends VendorForm {
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    submitted: boolean = false;

    @Input() id: any;
    @Input() set data(item: Vendor) { super.populateVendor(item); };

    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public override fb: FormBuilder,
                public apiResolver: VendorLookupResolver,
                private service: SupplierManagementService) { super(fb); }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) { return; }

        this.submitted = true;
        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit({ refresh: true });
        };

        const error = (resp)=> { this.submitted = false; };

        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, form.value).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(form.value).subscribe(success, error);
        }
    }

    updateAmtCalcFormulaId(val) { this.formAmtCalcFormulaId.setValue(val); }
    get formAmtCalcFormulaId() { return this.customForm.get('amountCalcTypeId'); }

    updateCostCalcFormulaId(val) { this.formCostCalcFormulaId.setValue(val); }
    get formCostCalcFormulaId() { return this.customForm.get('costCalcTypeId'); }
}
