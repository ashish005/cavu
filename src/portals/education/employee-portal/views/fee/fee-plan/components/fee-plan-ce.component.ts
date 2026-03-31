import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { Subscription, pairwise, startWith, filter } from "rxjs";
import {FeePlanForm} from "../forms/fee-plan.form";
import {FeePlanLookupService} from "../services/api.resolver";
import {CourseLookup, OrgSessionLookup} from "../domains/fee-plan.lookup";
import {ACTION_ENUM, fadeInOut} from "@app-global";
import {FeePlanService} from "../services/fee-plan.service";

@Component({
    standalone: false,
    templateUrl: './templates/fee-plan-ce.html',
    animations: [fadeInOut],
    styles: [`:host{ display: contents; }`]
})
export class FeePlanCeComponent extends FeePlanForm implements OnInit, OnDestroy {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    @ViewChild('planStructureTest', { static: true }) public planStructureTest;

    @Input() id: string;
    @Input() set data(val){ this.populateFeePlanForm(val); };
    @Output() onOk: EventEmitter<any>= new EventEmitter<any>();

    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    loading: boolean = true;
    submitted: boolean = false;
    private subscriber: Subscription;

    //Separate from api call
    filteredCourse: Array<CourseLookup> = [];
    selectedCourse: CourseLookup;
    formDisabled: boolean = true;
    schedularInfo: Array<any> = []; //Special case - multi select array
    constructor(public override fb: FormBuilder, public service: FeePlanService, public lookupService: FeePlanLookupService) {
        super(fb);

        const studyModeFormValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next) {
                this.filteredCourse = this.lookupService.masterType.getCourseByModeType(next);
                this.selectedCourse = null;
                this.formCourseSection.reset();
            }
        };
        const courseFormValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next) {
                this.selectedCourse = (this.filteredCourse || []).find(r => r.id == next);
                this.getDefaultFeeStructure();
            }
        };

        this.formStudyMode.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(studyModeFormValueChange);
        this.formCourse.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(courseFormValueChange);
    }

    getDefaultFeeStructure(){
        this.service
            .getDefaultFeeStructure(this.formStudyMode.value, this.selectedCourse.studyLevelId, this.id || 0)
            .toPromise()
            .then(r => {
                this.formFeeStructureList.controls.length = 0;
                (r || []).map((r)=> this.addNewRow(r));
            });
    }

    ngOnInit(){
        // this.formCourseSection.valueChanges.pipe(
        //     startWith(null as string),
        //     pairwise(),
        //     filter(r => this.formStudyLevelId.value && this.formStudyMode.value)
        // ).subscribe(courseSectionFormValueChange);
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }
    feeTypeChange(data){
        const { id } = data;
        //this.refreshFeePlan(id);
    }
    //createNew(){ this.populateFeePlanForm(new FeePlan()); }

    /*refreshFeePlan(id){
        this.loading = true;
        const success = (resp) => { this.loading = false; this.populateFeePlanForm(resp.data); };
        const failure = (err)=>{ this.loading = false; this.createNew(); };
        this.subscriber = this.service.read(id).subscribe(success, failure);
    }*/

    onSubmit(customForm) {
        // stop here if form is invalid
        if (customForm.invalid) { return; }
        this.submitted = true;
        const onError = (resp) => { this.submitted = false; };

        const success = (resp: any)=>{
            this.submitted = false;
            this.onOk.emit(true);
        };

        const rawVal = customForm.getRawValue();
        if(this.id){
            this.service.update(this.id, rawVal).subscribe(success, onError);
        } else {
            this.service.create(rawVal).subscribe(success, onError);
        }
    }

    // this.customForm.getRawValue();
    // const rawVal = this.formFeeStructureList.getRawValue();
    structureTest(structure){
        const { startDate, endDate }: OrgSessionLookup = this.lookupService.masterType.orgSession.find(r => r.id == this.formOrgSession.value);
        const { defaultDay, defaultMonth, depositDurationType, frequencyMasterType } = structure;
        const req = {
            startTimeZoneDate: startDate,
            endTimeZoneDate: endDate,
            frequencyMasterType: frequencyMasterType,
            hasNoExpiration: false,
            dayNo: defaultDay || -1,
            monthNo: defaultMonth,
            monthInterval: depositDurationType
        };
        this.planStructureTest.updateSchedulers(req);
    }
}