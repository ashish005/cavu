import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { ViewExtender } from "@app-global";
import {LogAPIResolver} from "../services/api.resolver";
import {ErrorLog, ErrorLogQueryOptions} from "../domains/error-log.serializer";
import {ErrorLogService} from "../services/log.service";

@Component({
    standalone: false,
  templateUrl: './templates/error-log-view.html'
})
export class ErrorLogView extends ViewExtender<ErrorLog> implements OnInit, OnDestroy{
    override coreState: ErrorLogQueryOptions = new ErrorLogQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public apiResolver: LogAPIResolver,
                public override service: ErrorLogService) {
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
