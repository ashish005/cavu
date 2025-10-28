import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LogAPIResolver} from "../services/api.resolver";
import { ViewExtender } from "@app-global";
import {DataLog, DataLogQueryOptions} from "../domains/data-log.serializer";
import {DataLogService} from "../services/log.service";

@Component({
    standalone: false,
  templateUrl: './templates/data-log-view.html'
})
export class DataLogView extends ViewExtender<DataLog> implements OnInit, OnDestroy{
    override coreState: DataLogQueryOptions = new DataLogQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public apiResolver: LogAPIResolver,
                public override service: DataLogService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs= [
            {headerName: 'Name', field: 'name'},
            {headerName: 'Created Date', field: 'createdDate'},
            {headerName: 'modified Date', field: 'modifiedDate'}
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }
}
