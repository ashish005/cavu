import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {OrgLicenseHistory, OrgLicenseHistoryQueryOptions} from "../domains/org-license-history.serializer";
import {OrgLicenseHistoryService} from "../services/license-history.service";
import {DateFormatCell, ViewExtender} from "@app-global";

@Component({
    standalone: false,
  templateUrl: './templates/pricing-history.html'
})
export class LicenseHistoryView extends ViewExtender<OrgLicenseHistory> implements OnInit {
    @ViewChild('orgLicenseGrid', { static: true }) orgLicenseGrid;
    override coreState: OrgLicenseHistoryQueryOptions = new OrgLicenseHistoryQueryOptions();
    constructor(public override service: OrgLicenseHistoryService,
                public router: Router,
                public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'API Key', field: 'apiKeyName' },
            {headerName: 'License Type', field: 'licenseTypeName' },
            {headerName: 'License No', field: 'licenseNo' },
            {headerName: 'Valid From', field: 'validFrom', cellTemplate: DateFormatCell },
            {headerName: 'Is Valid', field: 'isValidLicense' },
            {headerName: 'Validity(Days)', field: 'validityInDays' },
            {headerName: 'status', field: 'status' }
        ];
    }

    ngOnInit(){
        super.populateGrid();
    }

    override ngOnDestroy()
    {
        super.ngOnDestroy();
    }
    actionCb(e){}
}
