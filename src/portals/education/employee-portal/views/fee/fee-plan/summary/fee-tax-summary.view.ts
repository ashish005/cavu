import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FeePlanLookupService} from "../services/api.resolver";
import {ActivatedRoute} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FeeTypeService} from "../services/fee-type.service";
import {FeeTax} from "../domains/fee-tax.serializer";

@Component({
    standalone: false,
    selector: 'fee-tax',
    templateUrl: './templates/fee-taxes.html',
    styles: [`:host{ display: contents; }`]
})
export class FeeTaxSummaryView implements OnInit, OnDestroy {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    loading: boolean = true;
    customForm: FormGroup;

    activeStudyLevel: any;
    activeStudyMode: any;
    constructor(public fb: FormBuilder, public activatedRoute: ActivatedRoute, public service: FeeTypeService, public lookupService: FeePlanLookupService) {
        this.customForm = this.fb.group({
            feeTaxes: this.fb.array([])
        });
    }

    get f() { return this.customForm.controls; }
    get formFeeTaxes(): FormArray<FormGroup> { return this.customForm.get('feeTaxes') as FormArray<FormGroup>;}

    initMapperRow(data: FeeTax) {
        const { id, name, feeTypeId, studyLevelTypeId, studyModeTypeId, taxMapperId, categoryId, hasExtraTaxRate, extraTaxRate, taxTypeRateId, rate } = data;
        const form = this.fb.group({
            id: [ id || null],
            name: [ name ],
            feeTypeId: [feeTypeId, Validators.required],
            studyLevelTypeId: [studyLevelTypeId, Validators.required],
            studyModeTypeId: [studyModeTypeId, Validators.required],
            taxMapperId: [taxMapperId],
            categoryId: [categoryId],
            hasExtraTaxRate: [hasExtraTaxRate],
            extraTaxRate: [extraTaxRate],
            taxTypeRateId: [taxTypeRateId],
            rate: [rate]
        });
        return form;
    }

    addNewRow(data: FeeTax) { this.formFeeTaxes.push(this.initMapperRow(data));}

    populateData(records: Array<any>){
        this.formFeeTaxes.controls.length = 0;
        (records || [{}]).map((r)=> this.addNewRow(r));
    }

    changeStudyLevel(item){
        this.activeStudyLevel = item;
        this.callApi();
    }

    changeStudyMode(item){
        this.activeStudyMode = item;
        this.callApi();
    }

    ngOnInit(){
        const { studyLevel, studyMode } = this.lookupService.masterType;
        this.activeStudyLevel = studyLevel[0];
        this.activeStudyMode = studyMode[0];

        this.callApi();
    }

    callApi(){
        this.service.getFeeTypeTaxes(this.activeStudyMode.id, this.activeStudyLevel.id)
            .toPromise()
            .then(r => { this.populateData(r); });
    }

    ngOnDestroy(){}

    updateFeeTypeTaxes(){
        const val = this.formFeeTaxes.value;
        this.service.updateFeeTypeTaxes(this.activeStudyMode.id, this.activeStudyLevel.id, val)
            .toPromise()
            .then(r => { this.callApi(); });
    }
}