import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DateFormatCell, NumberCell, ViewExtender} from "@app-global";
import {StudentBatchService, StudentService} from "../services";
import {
    StudentBatchClassGridCellComponent,
    StudentBatchCourseGridCellComponent, StudentBatchFeePlanGridCellComponent,
    StudentBatchNameGridCellComponent
} from "../grid-cells/batch-grid-cell.component";
import {StudentBatch, StudentBatchQueryOptions} from "../domains/batch.serializer";

@Component({
    standalone: false,
  templateUrl: './templates/batch.html'
})
export class StudentBatchView extends ViewExtender<StudentBatch> implements OnInit, OnDestroy {
    override coreState: StudentBatchQueryOptions = new StudentBatchQueryOptions()
    constructor(public router: Router, public override activatedRoute: ActivatedRoute,
                public override service: StudentBatchService, public apiResolver: StudentService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: false, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Name/ Session', field: 'orgBatch', cellTemplate: StudentBatchNameGridCellComponent },
            {headerName: 'Class', field: 'orgClass', cellTemplate: StudentBatchClassGridCellComponent },
            {headerName: 'Form No', field: 'applicationFormNo' },
            {headerName: 'Enrollment Date', field: 'enrollmentDate', cellTemplate: DateFormatCell },
            {headerName: 'Roll No', field: 'rollNo' },
            {headerName: 'Fee Plan', field: 'feePlan', cellTemplate: StudentBatchFeePlanGridCellComponent },
            {headerName: 'Course', field: 'course', cellTemplate: StudentBatchCourseGridCellComponent },
            {headerName: 'Total', field: 'totalFee', class: 'text-right', cellTemplate: NumberCell },
            {headerName: 'Paid', field: 'paid', class: 'text-right', cellTemplate: NumberCell },
            {headerName: 'Due', field: 'dueFee', class: 'text-right', cellTemplate: NumberCell },
            {headerName: 'Balance', field: 'balance', class: 'text-right', cellTemplate: NumberCell },
            {headerName: 'Advance', field: 'advance', class: 'text-right', cellTemplate: NumberCell },
        ];
        // feePlanInfo
    }

    ngOnInit(){
        (<StudentBatchQueryOptions>this.coreState).studentId = this.apiResolver.student.id;
        super.populateGrid();
    }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    createNew(){}
    actionCb(e){}
}