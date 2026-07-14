import {Component, Directive, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {VendorLookupResolver} from "../services/api.resolver";
import {pairwise, startWith} from "rxjs";
import {VendorProductBrand} from "../domains/vendor.lookup";
import {CommonModule} from "@angular/common";

@Directive()
class VendorBrandForm
{
    public customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            remark: [null, Validators.required],
            brandId: [null, Validators.required],
            divisionId: [null],

            marginRatio: [null],
            monthlyTargetValue: [null],

            brandName: [null],

            divisionName: [null],
            divisionDescription: [null]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populateBranch(item: any){
        const {
            id, remark, brandId, divisionId,
            marginRatio, monthlyTargetValue
        } = item || {};
        this.customForm.get('id').setValue(id);
        this.customForm.get('remark').setValue(remark);
        this.customForm.get('brandId').setValue(brandId);
        this.customForm.get('divisionId').setValue(divisionId);

        this.customForm.get('marginRatio').setValue(marginRatio);
        this.customForm.get('monthlyTargetValue').setValue(monthlyTargetValue);
    }

    get formBrandId() { return this.customForm.get('brandId') as FormGroup; }
    get formDivisionId() { return this.customForm.get('divisionId') as FormGroup; }

    updateBrandId(val){ this.formBrandId.setValue(val); }
    updateDivisionId(val){ this.formDivisionId.setValue(val); }

    isNewBrand: boolean = false;
    get formBrandName(){ return this.customForm.get('brandName'); }


    isNewDivision: boolean = true;
    get formDivisionName(){ return this.customForm.get('divisionName'); }
    get formDivisionDescription(){ return this.customForm.get('divisionDescription'); }
}

@Component({
    templateUrl: `./templates/vendor-brand-ce.html`,
    styles: [`:host { display: contents;}`],
  standalone: false
})
export class VendorBrandCEComponent extends VendorBrandForm {
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() vendorId: string;
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    brand: VendorProductBrand;
    imageUrl: string;
    constructor(public override fb: FormBuilder, public apiResolver: VendorLookupResolver) {
        super(fb);
        const itemFormBrandChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                this.brand = this.apiResolver.masterType?.getBrandById(next);
                this.toggleNewDivision((this.isNewDivision && this.brand?.divisions.length));
            }
        };
        this.formBrandId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormBrandChange);
    }

    toggleNewBrand(){
        this.isNewBrand = !this.isNewBrand;
        if(this.isNewBrand){
            this.formBrandName.setValidators([Validators.required]);
            this.formBrandName.enable();
            this.formBrandId.disable();
        } else {
            this.formBrandName.clearValidators();
            this.formBrandName.disable();
            this.formBrandId.enable();
        }
        this.toggleNewDivision((this.isNewDivision));
    }
    toggleNewDivision(isNewDivision){
        this.isNewDivision = isNewDivision;
        if(this.isNewDivision){
            this.formDivisionName.setValidators([Validators.required]);
            this.formDivisionName.enable();
            this.formDivisionId.disable();
        } else {
            this.formDivisionName.clearValidators();
            this.formDivisionName.disable();
            this.formDivisionId.enable();
        }
    }

    updateImage(img){}

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
        this.submitted = true;
        // if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
        //     this.service.update(this.id, data).subscribe(success, error);
        // } else if(this.actionType == ACTION_ENUM.ADD) {
        //     this.service.create(data).subscribe(success, error);
        // }
    }
}
