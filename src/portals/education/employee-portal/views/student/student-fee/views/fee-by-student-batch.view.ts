import {Component, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {StudentFeeQueryOptions} from "../domains/fee-by-class.serializer";
import {FeeByStudentBatch} from "../domains/fee-by-student-batch.serializer";
import {FeeByStudentBatchService} from "../services/fee-by-student-batch.service";
import {SBCourseNameActionCell, SBStudentNameActionCell} from "../grid-cells";
import {StudentFeeBreakupActionCell} from "../grid-cells/student-batch-grid-cell.component";
import {NumberCell, ViewExtender} from "@app-global";

@Component({ standalone: false, templateUrl: './templates/fee-by-view.html' })
export class FeeByStudentBatchView extends ViewExtender<FeeByStudentBatch> implements OnInit {
    override coreState: StudentFeeQueryOptions = new StudentFeeQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute, public override service: FeeByStudentBatchService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: false, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Course', cellTemplate: SBCourseNameActionCell },
            {headerName: 'Student', field: 'studentName' },
            {headerName: 'Reg. No', field: 'registrationNo' },
            {headerName: 'Action', cellTemplate: SBStudentNameActionCell },
            {headerName: 'Fee Breakup', cellTemplate: StudentFeeBreakupActionCell },
            {headerName: 'Due Date', field: 'dueDate'},
            {headerName: 'Total Fee', field: 'totalFee', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Paid', field: 'paid', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Due Fee', field: 'dueFee', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Advance', field: 'advance', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Balance', field: 'balance', class: 'text-right', cellTemplate: NumberCell}
        ];
    }

    ngOnInit(){
        super.populateGrid();
    }
    actionCb(e){}
}