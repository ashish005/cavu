import {Component, Directive, Injectable, Injector, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BusinessCell, BusinessNameCell} from "../components/grid.cell.component";
import {ActivatedRoute} from "@angular/router";
import {DateFormatCell, ASIDE_CLASS, ASIDE_SIZE, ViewExtender, GridUISwitchCellComponent} from "@app-global";
import {Business, BusinessQueryOptions} from "../domains/business.serializer";
import {BusinessAPIResolver} from "../services/api.resolver";
import {BusinessService} from "../services/business.service";

@Component({
    templateUrl: './templates/business-manage.html',
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
            {headerName: 'Name', field: 'name', cellTemplate: BusinessNameCell },
            {headerName: 'Country', field: 'countryName'},
            {headerName: 'Business', field: 'businessTypeName', cellTemplate: BusinessCell },
            {headerName: 'Software', field: 'softwareName'},
            {headerName: 'Sector', field: 'sectorName'},
            {headerName: 'Active License', field: 'activeLicenseCount' },
            {headerName: 'Modules', field: 'enabledModuleCount' },
            {headerName: 'Users', field: 'userCount' },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
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
