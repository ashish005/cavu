import {Component, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {StudentFeeQueryOptions} from "../domains/fee-by-class.serializer";
import {FeeByTypeService} from "../services/fee-by-type.service";
import {FeeByType} from "../domains/fee-by-type.serializer";
import {NumberCell, ViewExtender} from "@app-global";

@Component({ standalone: false, templateUrl: './templates/fee-by-view.html' })
export class FeeByFeeTypeView extends ViewExtender<FeeByType> implements OnInit {
    override coreState: StudentFeeQueryOptions = new StudentFeeQueryOptions();
    constructor(public router: Router, public override activatedRoute: ActivatedRoute, public override service: FeeByTypeService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: false, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Fee Head', field: 'feeTypeName'},
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