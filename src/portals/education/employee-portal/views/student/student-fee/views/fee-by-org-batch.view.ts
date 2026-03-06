import {Component, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FeeByOrgBatchService} from "../services/fee-by-org-batch.service";
import {FeeByOrgBatch} from "../domains/fee-by-org-batch.serializer";
import {StudentFeeQueryOptions} from "../domains/fee-by-class.serializer";
import {NumberCell, ViewExtender} from "@app-global";

@Component({ standalone: false, templateUrl: './templates/fee-by-view.html'})
export class FeeByOrgBatchView extends ViewExtender<FeeByOrgBatch> implements OnInit {
    override coreState: StudentFeeQueryOptions = new StudentFeeQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute, public override service: FeeByOrgBatchService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: false, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Students', field: 'totalStudents' },
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