import {
    Component,
    OnDestroy,
    OnInit
} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, DateFormatCell, ViewExtender} from "@app-global";
import {Driver, DriverQueryOptions} from "../domains/driver.serializer";
import {ActivatedRoute, Router} from "@angular/router";
import {DriverService} from "../services/driver.service";
import {DriverAPIResolver} from "../services/api.resolver";

@Component({
    templateUrl: './templates/manage.html',
  standalone: false
})
export class DriverManageView extends ViewExtender<Driver> implements OnInit, OnDestroy{
  override coreState: DriverQueryOptions = new DriverQueryOptions();
    constructor(public router: Router, public apiResolver: DriverAPIResolver,
                public override activatedRoute: ActivatedRoute, public override service: DriverService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Plan', field: 'planName' },
            {headerName: 'License Type', field: 'licenseTypeName' },
            {headerName: 'DL Number', field: 'licenseTypeName' },
            {headerName: 'DL Validity', field: 'dlValidity', cellTemplate: DateFormatCell },
            {headerName: 'Insurance Validity', field: 'insuranceValidity', cellTemplate: DateFormatCell },
            {headerName: 'Joining', field: 'joiningDate', cellTemplate: DateFormatCell },
            {headerName: 'Shift', field: 'shiftName' },
            {headerName: 'Experience (Years)', field: 'experience' }
        ];
    }

    ngOnInit(){
        super.populateGrid();
    }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: Driver){
        const inputData: any = {
            id: row.id,
            data: row
        };
        this.apiResolver.createEditDriver(inputData, {text: `${row.name}`, desc: '' }, ()=>{
            super.populateGrid();
        });
    }

    createNew(){
        const inputData: any = {
            id: null,
            data: {}
        };
        this.apiResolver.createEditDriver(inputData, {text: 'New Driver', desc: '' }, ()=> {
            super.populateGrid();
        });
    }
}
