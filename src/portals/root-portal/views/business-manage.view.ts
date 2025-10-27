import {Component, Directive, Injector, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Branch, Business, BusinessQueryOptions} from "../domains/business.serializer";
import {BusinessService} from "../services/business.service";
import {BusinessPermissionInfo, BusinessContactGridCell} from "../components/grid.cell.component";
import {ActivatedRoute} from "@angular/router";
import {BusinessAPIResolver} from "../services/api.resolver";
import {DateFormatCell, ASIDE_CLASS, ASIDE_SIZE, CoreResponse, ViewExtender} from "@app-global";

@Component({
    templateUrl: './templates/business-manage.html',
    styles: [ `#manage_business .modal-dialog{ width: auto;}`],
    standalone: false
})
export class BusinessManageView extends ViewExtender<Business> implements OnInit{
    override coreState: BusinessQueryOptions = new BusinessQueryOptions();
    constructor(protected override activatedRoute: ActivatedRoute,
                protected override service: BusinessService,
                public apiResolver: BusinessAPIResolver
    ) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Business Type', field: 'orgBusinessType' },
            {headerName: 'License', cellTemplate: BusinessPermissionInfo },
            {headerName: 'Country', field: 'countryName'},
            {headerName: 'OperatedBy', field: 'operatedByName'},
            {headerName: 'Contact', cellTemplate: BusinessContactGridCell },
            {headerName: 'Created Date', field: 'createdDate', cellTemplate: DateFormatCell },
        ];
    }

    ngOnInit() {
      this.refreshGrid();
      // this.activatedRoute.paramMap.subscribe(params => {
      //   //this.coreState.countryId = this.activatedRoute.snapshot.params.countryId;
      //   this.refreshGrid();
      // });
    }

    actionCb(row: Business) {
        const inputData = {
            id: row.id,
            data: row
        };
        this.apiResolver.showBusinessCEPopup(inputData, { text: `Edit Org Unit`, desc: `Setup Business` }, ()=>{ this.refreshGrid(); });
    }

    newBusiness() {
        const inputData: any = {
            id: null,
            data: null
        };
        this.apiResolver.showBusinessCEPopup(inputData, { text: `New Business`, desc: `Setup Business` }, ()=>{ this.refreshGrid(); });
    }

    showClientBusinessPopup() {
        const popup = {
            header: { text: `new Business`, desc: `new Business` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        const inputData = {
            id: null,
            data: {
                "name": "Mac Ingenieria",
                "licenseNo": "123212313",
                "validFromDate": "2021-04-30",
                "validToDate": "2022-03-30",
                "contactPersonEmail": "Miguel@macingenieria.pe",
                "contactPersonMobile": "999999999",
                "contactPersonName": "Miguel Ángel Castro Pereda",
                "isLocked": true,
                "userName": "miguel",
            }
        };
        this.apiResolver.showBusinessCEPopup(inputData, { text: `Edit Org Unit`, desc: `Setup Business` }, ()=>{ this.refreshGrid(); });
    }
}
