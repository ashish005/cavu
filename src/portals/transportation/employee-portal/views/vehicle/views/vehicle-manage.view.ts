import {
    Component,
    OnDestroy,
    OnInit
} from "@angular/core";
import {DateFormatCell, ViewExtender} from "@app-global";
import {Vehicle, VehicleQueryOptions} from "../domains/vehicle.serializer";
import {ActivatedRoute, Router} from "@angular/router";
import {VehicleService} from "../services/vehicle.service";
import {VehicleAPIResolver} from "../services/api.resolver";
import {VehicleScheduleInspectionActionCell} from "../grid-cells/vehicle-grid-cell.component";

@Component({
    templateUrl: './templates/manage.html',
  standalone: false
})
export class VehicleManageView extends ViewExtender<Vehicle> implements OnInit, OnDestroy{
  override coreState: VehicleQueryOptions = new VehicleQueryOptions();
    constructor(public router: Router,
                public apiResolver: VehicleAPIResolver, public override activatedRoute: ActivatedRoute, public override service: VehicleService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Vehicle No', field: 'vehicleNo' },
            {headerName: 'Contract Type', field: 'contractTypeName' },
            {headerName: 'Mileage', field: 'mileageName' },
            {headerName: 'Insurance Validity', field: 'insuranceValidity', cellTemplate: DateFormatCell },
            {headerName: 'Inspection Frequency', field: 'inspectionFrequencyName' },
            {headerName: 'Last Inspection ', field: 'lastInspectionDate' },
            {headerName: 'Last Service', field: 'lastServiceDate' },
            {headerName: 'Under Inspection', field: 'isUnderInspection' },
            {headerName: 'Under Service', field: 'isUnderService' },
            {headerName: 'Status', field: 'vehicleStatus' },
            {headerName: 'Inspection', cellTemplate: VehicleScheduleInspectionActionCell }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: Vehicle){
        const inputData: any = {
            id: row.id,
            data: row
        };
        this.apiResolver.createEditVehicle(inputData, {text: `${row.vehicleNo}`, desc: '' }, ()=>{
            super.populateGrid();
        });
    }

    createNew(){
        const inputData: any = {
            id: null,
            data: {}
        };
        this.apiResolver.createEditVehicle(inputData, {text: 'New Vehicle', desc: '' }, ()=> {
            super.populateGrid();
        });
    }
}
