import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM, DateFormatCell, ViewExtender} from "@app-global";
import {pairwise, startWith} from "rxjs";

import {VehicleAPIResolver} from "../services/api.resolver";
import {VehicleInspection, VehicleInspectionQueryOptions} from "../domains/vehicle-inspection.serializer";
import {ActivatedRoute, Router} from "@angular/router";
import {VehicleInspectionService} from "../services/vehicle-inspection.service";
import {VehicleInspectionStatusCellComponent} from "../grid-cells/vehicle-inspection-grid-cell.component";

@Component({
    templateUrl: `./templates/vehicle-inspection-history.html`, standalone: false
})
export class VehicleInspectionHistoryComponent extends ViewExtender<VehicleInspection> implements OnInit {
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    @Input() id: any;
    override coreState: VehicleInspectionQueryOptions = new VehicleInspectionQueryOptions();
    constructor(public router: Router, public override activatedRoute: ActivatedRoute,
                public apiResolver: VehicleAPIResolver, public override service: VehicleInspectionService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: false, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Vehicle No', field: 'vehicleNo' },
            {headerName: 'Due Date', field: 'dueDate', cellTemplate: DateFormatCell },
            {headerName: 'Status', cellTemplate: VehicleInspectionStatusCellComponent },
            {headerName: 'Inspected By', field: 'inspectedByName' },
            {headerName: 'Detail Count', field: 'detailCount' }
        ];
    }

    ngOnInit(){
        const today = new Date().toISOString().split('T')[0];
        this.coreState.vehicleId = this.id;
        this.coreState.tillDate = today;
        this.populateGrid();
    }
}
