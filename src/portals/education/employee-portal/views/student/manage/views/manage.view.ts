import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {StudentSummary, StudentSummaryQueryOptions} from "../domains/student.serializer";
import {StudentSummaryService} from "../services";
import {
    StudentNameActionCell,
    StudentActionCell,
    SyncStudentFeeActionCell, ChallanFeeBreakupActionCell
} from "../grid-cells/student-grid-cell.component";
import {NumberCell, UserImageComponent, ViewExtender} from "@app-global";

@Component({
    standalone: false,
  templateUrl: './templates/manage.html'
})
export class StudentManageView extends ViewExtender<StudentSummary> implements OnInit, OnDestroy {
    override coreState: StudentSummaryQueryOptions = new StudentSummaryQueryOptions();
    constructor(public router: Router, public override activatedRoute: ActivatedRoute, public override service: StudentSummaryService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: '', cellTemplate: UserImageComponent },
            {headerName: 'Name', field: 'name', cellTemplate: StudentNameActionCell },
            {headerName: 'Name', field: 'name', cellTemplate: StudentActionCell },
            {headerName: 'Fee Breakup', cellTemplate: ChallanFeeBreakupActionCell },
            {headerName: 'Fee Synced', cellTemplate: SyncStudentFeeActionCell },
            {headerName: 'Total', field: 'totalFee', class: 'text-right', cellTemplate: NumberCell },
            {headerName: 'Paid', field: 'paid', class: 'text-right', cellTemplate: NumberCell },
            {headerName: 'Due', field: 'dueFee', class: 'text-right', cellTemplate: NumberCell },
            {headerName: 'Balance', field: 'balance', class: 'text-right', cellTemplate: NumberCell },
            {headerName: 'Advance', field: 'advance', class: 'text-right', cellTemplate: NumberCell },
            //{headerName: '', cellTemplate: OrgStudentActionCellComponent },
        ];
    }

    ngOnInit(){
        this.service.refresh.subscribe(r => { super.populateGrid(); });
        super.populateGrid();
    }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: StudentSummary) {
        this.router.navigate([row.id, 'info'], {relativeTo: this.activatedRoute});
    }
    createNew(){
        this.router.navigate(['create'], {relativeTo: this.activatedRoute});
    }

    feeView(){
        this.router.navigate(['../', 'fee'], {relativeTo: this.activatedRoute.parent});
    }
}