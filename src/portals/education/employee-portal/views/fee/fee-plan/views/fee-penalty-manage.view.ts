import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {UserAuditInfoCell, ViewExtender} from "@app-global";
import {FeePenaltyTypeService} from "../services/fee-penalty-type.service";
import {FeePenaltyType, FeePenaltyTypeQueryOptions} from "../domains/fee-penalty-type.serializer";

@Component({
    standalone: false,
    templateUrl: './templates/manage-master.html'
})
export class FeePenaltyManageView extends ViewExtender<FeePenaltyType> implements OnInit, OnDestroy {
    override coreState: FeePenaltyTypeQueryOptions = new FeePenaltyTypeQueryOptions();

    constructor(public override service: FeePenaltyTypeService, public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        const translate_path = 'modules.project.manage.grid';
        this.gridOptions.columnDefs = [
            {headerName: `${translate_path}.name`, field: 'name'},
            {
                headerName: `${translate_path}.audit`,
                field: 'userAudit',
                class: 'float-right',
                cellTemplate: UserAuditInfoCell
            }
        ];
    }

    ngOnInit() {
        super.populateGrid();
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
    }

    actionCb(row: FeePenaltyType) {
        const inputData: any = {
            id: row.id,
            data: row
        };
        // this.feePlanFactory.ceFeePenaltyPopup(inputData, {text: `${row.name}`, desc: ''}).then(()=>{
        //     super.populateGrid();
        // });
    }

    createNew() {
        const inputData: any = {
            id: null,
            data: {}
        };
        // this.feePlanFactory.ceFeePenaltyPopup(inputData, {text: 'New Concession', desc: ''}).then(()=>{
        //     super.populateGrid();
        // });
    }
}

