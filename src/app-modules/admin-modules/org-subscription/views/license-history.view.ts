import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {CoreQueryOptions, DateFormatCell, FullDateFormatCell, ViewExtender} from "@app-global";
import {LicenseHistoryRow} from "../domains/grid-row.serializers";
import {LicenseHistoryService} from "../services";

@Component({
    standalone: false,
    templateUrl: './templates/grid-page.html'
})
export class LicenseHistoryView extends ViewExtender<LicenseHistoryRow> implements OnInit {
    override coreState = new CoreQueryOptions();

    constructor(public override service: LicenseHistoryService, public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Date', field: 'occurredAt', cellTemplate: FullDateFormatCell},
            {headerName: 'Event', field: 'eventLabel'},
            {headerName: 'Plan', field: 'planLabel'},
            {headerName: 'Status', field: 'statusLabel'},
            {headerName: 'Valid From', field: 'currentValidFrom', cellTemplate: DateFormatCell},
            {headerName: 'Valid To', field: 'currentValidTo', cellTemplate: DateFormatCell},
            {headerName: 'License No', field: 'licenseNo'},
            {headerName: 'Remark', field: 'remark'}
        ];
    }

    ngOnInit() { this.populateGrid(); }

    actionCb(_: any) {}
}
