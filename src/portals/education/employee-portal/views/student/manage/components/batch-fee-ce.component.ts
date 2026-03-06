import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BatchFeeFormForm} from "../forms/student-batch-fee.form";
import {BatchCourseFeeService} from "../services/batch-course-fee.service";
import {StudentBatchLookupService, StudentOrgBatchLookupService} from "../services/api.resolver";
import {pairwise, startWith} from "rxjs";
import {distinctUntilChanged} from "rxjs";
import {debounceTime, switchMap, tap} from "rxjs";
import {catchError, of} from "rxjs";
import {ACTION_ENUM} from "@app-global";

@Component({
    standalone: false,
    selector: 'batch-fee-ce',
    templateUrl: './templates/batch-fee-ce.html',
    styles: [`:host { display: contents; } .small-table td, .small-table th{ padding: 0px}`],
    providers: [StudentOrgBatchLookupService]
})
export class BatchFeeCeComponent extends BatchFeeFormForm implements OnInit {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    @Input() id: any;
    @Input() studentId: string;

    public get actionType(){ return (this.id) ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; }
    submitted: boolean;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    
    courseList: Array<any> = [];
    courseSectionList: Array<any> = [];
    classList: Array<any> = [];
    classSectionList: Array<any> = [];
    feePlanList: Array<any> = [];

    constructor(public override fb: FormBuilder, public batchService: BatchCourseFeeService,
                public batchLookupService: StudentOrgBatchLookupService,
                public lookupService: StudentBatchLookupService)
    {
        super(fb);
    }

    ngOnInit() {
        const feeOrgBatchValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next) {
                const batch = this.lookupService.masterType.getBatchById(next);
                if(batch?.studyModeTypeId) {
                    this.updateStudyMode(batch?.studyModeTypeId);
                    this.formStudyMode.disable();
                } else {
                    this.formStudyMode.enable();
                }
                this.formOrgSession.setValue(<any>batch?.orgSessionId);
                this.populateOrgBatchLookups(next);
            }
        };
        this.formOrgBatch.valueChanges.pipe(startWith(null as string), pairwise(), distinctUntilChanged()).subscribe(feeOrgBatchValueChange);

        this.formCourse.valueChanges.pipe(startWith(null as string), pairwise(), distinctUntilChanged()).subscribe(([prev, next]: [any, any]) =>
        {
            if(prev != next) {
                this.courseSectionList = (this.courseList.find(r => r.id == next) || { sections: []}).sections || [];
            }
        });

        this.formClass.valueChanges.pipe(startWith(null as string), pairwise(), distinctUntilChanged()).subscribe(([prev, next]: [any, any]) =>
        {
            if(prev != next) {
                this.classSectionList = (this.classList.find(r => r.id  == next) || { classSections: []}).classSections;
            }
        });

        this.customForm.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged((prev, curr) => {
                    return (
                        prev.studyModeTypeId === curr.studyModeTypeId &&
                        prev.orgSessionId === curr.orgSessionId &&
                        prev.courseId === curr.courseId &&
                        prev.courseSectionId === curr.courseSectionId
                    );
                }),
                switchMap(() => this.getFeePlans()) // Only call the API if there is a change
            )
            .subscribe({
                next: (results: any) => {
                    // Handle the API results here
                    // You can assign the results to your component state
                    this.feePlanList = results; // Example: update the list of fee plans
                },
                error: (error) => {
                    // Handle any errors that occur in the subscribe process
                }
            });

        /*const feePlanValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next) {
                this.feePlanList = this.lookupService.masterType.getFeePlanByConcessionType(this.formFeeConcession.value, this.feePlanList);
            }
        };*/
        //this.formFeePlan.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(feePlanValueChange);
    }

    populateOrgBatchLookups(orgBatchId){
        this.batchLookupService.fetch(orgBatchId)
            .then(r => {
                // this.formCourse.reset();
                // this.formCourseSection.reset();
                // this.formClass.reset();
                // this.formClassSection.reset();
                this.populateLookups();
            });
    }

    getFeePlans() {
        if(!this.formOrgSession.value || !this.formStudyMode.value) {
            return of([]);
        }
        return this.batchLookupService
            .getFeePlans(this.formOrgSession.value, this.formStudyMode.value, this.formCourse.value || 0, this.formCourseSection.value || 0);
    }

    populateData(data: any){ super.populateForm(data); }

    populateLookups(){
        const { courses, classes } = this.batchLookupService.masterType;
        this.courseList = courses;
        this.classList = classes;
        //this.feePlanList = feePlans;
    }

    updateOrgBatch(batchId) { this.formOrgBatch.setValue(batchId); }

    updateCourse(courseId) { this.formCourse.setValue(courseId); }

    updateCourseSection(courseSectionId) { this.formCourseSection.setValue(courseSectionId); }

    updateClass(classId) {
        this.formClass.setValue(classId);
        this.formClassSection.reset();
    }

    updateFeePlan(planId) {
        this.formFeePlan.setValue(planId);
        this.calculateAndShowFeePlan();
    }

    updateFeeConcession(data) {
        this.formFeeConcession.setValue(data);
        this.calculateAndShowFeePlan();
    }

    calculateAndShowFeePlan(){
        const feeConcessionTypeId = this.formFeeConcession.value;
        //this.feePlanList = this.lookupService.masterType.getFeePlanByConcessionType(feeConcessionTypeId, this.feePlanList);
    }

    onSubmit(data: FormGroup){
        if (this.customForm.invalid) {
            return;
        }

        this.customForm.disable();
        const performAction = (resp)=> {
            this.customForm.enable();
            this.submitted = false;
            this.onOk.emit(resp);
        };

        const failure = ()=> {
            this.customForm.enable();
            this.submitted = false;
        };

        const sBatch: any = data.getRawValue();
        sBatch.studentId = this.studentId;
        this.submitted = true;
        if(this.id){
            this.batchService.update(this.id, sBatch).subscribe(performAction, failure);
        } else {
            this.batchService.create(sBatch).subscribe(performAction, failure);
        }
    }
}
