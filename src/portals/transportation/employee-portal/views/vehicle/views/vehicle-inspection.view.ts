import {
    Component,
    OnDestroy,
    OnInit
} from "@angular/core";
import {DateFormatCell, ViewExtender} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";
import {VehicleInspection, VehicleInspectionQueryOptions} from "../domains/vehicle-inspection.serializer";
import {VehicleInspectionService} from "../services/vehicle-inspection.service";
import {VehicleAPIResolver} from "../services/api.resolver";
import {VehicleInspectionStatusCellComponent} from "../grid-cells/vehicle-inspection-grid-cell.component";

@Component({
    templateUrl: './templates/inspection.html',
  standalone: false
})
export class VehicleInspectionView extends ViewExtender<VehicleInspection> implements OnInit, OnDestroy{
  override coreState: VehicleInspectionQueryOptions = new VehicleInspectionQueryOptions();
    constructor(public router: Router,
                public apiResolver: VehicleAPIResolver, public override activatedRoute: ActivatedRoute, public override service: VehicleInspectionService
    ) {
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

    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: VehicleInspection){}

    createNew(){}
}
