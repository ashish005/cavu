import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TaxCategory} from "../domains/tax-category.serializer";

export class TaxCategoryForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: [null, Validators.required],
            taxCode: [null],
            isService: [null],
            taxGroupId: [null, Validators.required],
            rateMapperRule: this.fb.array([])
        });
    }

    getRateMapperRuleFormGroup(data){
        return this.fb.group(<any>{
            id: [data.id || null],
            name: [ (data)?data.name:null, Validators.required],
            rate: [ (data)?data.rate:null, Validators.required],
            extraTaxRate: [ (data)?data.extraTaxRate:null],
            hasExtraTaxRate: [ (data)?data.hasExtraTaxRate:null],
            taxGroupId: [data.taxGroupId, Validators.required],
            taxTypeRateId: [data.taxTypeRateId, Validators.required],
            status: [ data.status || false],
            children: [ data.children || []]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get formRateMapperRule() { return <FormArray>this.customForm.get('rateMapperRule'); }
    get formTaxGroupId(){ return <FormGroup>this.customForm.get('taxGroupId'); }

    updateTaxGroupId(val){ this.formTaxGroupId.setValue(val); }
    addToFormRule(item){ this.formRateMapperRule.push(this.getRateMapperRuleFormGroup(item)); }

    mergeUpdate(taxTypes, row: TaxCategory){
        this.customForm.get('name').setValue(row.name);
        this.customForm.get('taxCode').setValue(row.taxCode);
        this.customForm.get('isService').setValue(row.isService);
        this.customForm.get('taxGroupId').setValue(row.taxGroupId);

        const rules = (row.taxTypeRateMapper || []);
        this.formRateMapperRule.controls.length = 0;
        const rowInfo = rules.reduce((prev, curr) => {
            prev[curr.id] = curr;
            return prev;
        }, {});

        (taxTypes || []).map(r => {
            const rowItem = rowInfo[r.id] || {};
            const item = {
                id: rowItem.taxMapperId || null,
                name: r.name || null,
                rate: r.rate || 0,
                taxGroupId: r.taxGroupId,
                taxTypeRateId: r.id,
                extraTaxRate: r.extraTaxRate,
                hasExtraTaxRate: r.hasExtraTaxRate,
                status: rowItem.status || false,
                children: rowItem.children || []
            };
            this.addToFormRule(item);
        });
    }
}