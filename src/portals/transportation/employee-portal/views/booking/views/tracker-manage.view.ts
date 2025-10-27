import {
    Component,
    OnDestroy,
    OnInit
} from "@angular/core";
import {ViewExtender} from "@app-global";
import {Tracker, TrackerQueryOptions} from "../domains/tracker.serializer";
import {ActivatedRoute, Router} from "@angular/router";
import {TrackerService} from "../services/tracker.service";
import {
    TrackerDriverActionCell,
    TrackerMeterReadingActionCell,
    TrackerRangeActionCell,
    TrackerVehicleModelActionCell
} from "../grid-cells/tracker-grid-cell.component";

@Component({
    templateUrl: './templates/manage.html',
    providers: [TrackerService],
    standalone: false
})
export class TrackerManageView extends ViewExtender<Tracker> implements OnInit, OnDestroy{
  override coreState: TrackerQueryOptions = new TrackerQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: TrackerService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Vehicle', cellTemplate: TrackerVehicleModelActionCell },
            {headerName: 'Driver', cellTemplate: TrackerDriverActionCell },
            {headerName: 'Operator', field: 'operatorName' },
            {headerName: 'Duration', cellTemplate: TrackerRangeActionCell },
            {headerName: 'Odometer Reading', field: 'fromMeterReading', cellTemplate: TrackerMeterReadingActionCell },
            {headerName: 'Travelled', field: 'travelDistance' },
            {headerName: 'Receipt', field: 'receipt' },
            {headerName: 'Balance', field: 'balance' }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: Tracker) {}
    createNew(){}
}
