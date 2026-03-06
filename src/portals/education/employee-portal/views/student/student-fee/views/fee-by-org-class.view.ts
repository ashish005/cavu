import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FeeByClassService} from "../services/fee-by-class.service";
import {FeeByClass, StudentFeeQueryOptions} from "../domains/fee-by-class.serializer";
import {NumberCell, ViewExtender} from "@app-global";

@Component({ standalone: false, templateUrl: './templates/fee-by-view.html'})
export class FeeByOrgClassView extends ViewExtender<FeeByClass> implements OnInit {
    override coreState: StudentFeeQueryOptions = new StudentFeeQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute, public override service: FeeByClassService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: false, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Class', field: 'name' },
            {headerName: 'Study Mode', field: 'studyModeTypeName' },
            {headerName: 'Students', field: 'totalStudents' },
            //{headerName: 'Due Date', field: 'dueDate'},
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

    actionCb(row: any) {
        this.router.navigate(['edit', row.id, 'info'], {relativeTo: this.activatedRoute.parent});
    }
}