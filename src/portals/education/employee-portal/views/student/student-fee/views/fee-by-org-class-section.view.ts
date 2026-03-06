import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {StudentFeeQueryOptions} from "../domains/fee-by-class.serializer";
import {FeeByClassSection} from "../domains/fee-by-class-section.serializer";
import {FeeByClassSectionService} from "../services/fee-by-class-section.service";
import {ClassSetionNameActionCell} from "../grid-cells";
import {NumberCell, ViewExtender} from "@app-global";

@Component({ standalone: false, templateUrl: './templates/fee-by-view.html' })
export class FeeByOrgClassSectionView extends ViewExtender<FeeByClassSection> implements OnInit {
    override coreState: StudentFeeQueryOptions = new StudentFeeQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute, public override service: FeeByClassSectionService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: false, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Class', cellTemplate: ClassSetionNameActionCell},
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