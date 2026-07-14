import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {CoreQueryOptions, GridUISwitchCellComponent, CoreEndpointBase} from "@app-global";
import {Subscription, catchError, Observable} from "rxjs";

const getTranslationString = (key) => `master_type.project.${key}`;

class MasterTypeQueryOptions extends CoreQueryOptions {
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {};
        return super.getParamByObject(obj);
    }
}

@Component({
  standalone: false,
  templateUrl: './templates/master-type.html',
  styles: [`:host { display: contents;}`]
})
export class MasterTypeLayout extends CoreEndpointBase implements OnInit, OnDestroy {
    pageTitle: string;
    public gridOptions: any = {
        header: {title: null, desc: null, add: true, refresh: true, edit: true, delete: false},
        total: 0,
        hasNext: false,
        hasPrevious: false,
        skip: 0,
        take: 25,
        columnDefs: []
    };
    gridData: Array<any> = [];
    coreState: MasterTypeQueryOptions = new MasterTypeQueryOptions();
    isLoading: boolean;
    paramsSubscription: Subscription;
    page: any;

    entity: string;
    get masterUrl() { return this.baseSectorAPIUrl + `productMasterType/${this.entity}`; }

    constructor(public override injector: Injector) {
        super(injector);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name'},
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    public items: Array<any> = [
        {
            id: 3, icon: "fa fa-dashboard", isHeading: true, name: "Product", sortOrder: 1,
            children:
                [
                    {name: 'Product Type', route: 'productType', key: 'type', sortOrder: 1},
                    {name: 'Attribute Type', route: 'productAttributeType', key: 'attributeType', sortOrder: 2},
                    {name: 'Category Type', route: 'productCategoryMaster', key: 'category', sortOrder: 3},
                    {name: 'Procurement Type', route: 'productProcurementType', key: 'procurementType', sortOrder: 4},
                    {name: 'Unit Type', route: 'metricUnitType', key: 'unitType', sortOrder: 5},
                    {name: 'Division', route: 'productDivision', key: 'division', sortOrder: 7}
                ]
        },
        {
            id: 3, icon: "fa fa-dashboard", isHeading: true, name: "Token", sortOrder: 1,
            children:
                [
                    {name: 'Token Type', route: 'productTokenType', key: 'tokenType', sortOrder: 6}
                ]
        },
        {
            id:3, icon:"fa fa-dashboard", isHeading: true, name: "Inventory", sortOrder: 3,
            children:
                [
                    { name: 'Storage Location Type', route: 'storageLocationType', key: 'locationType', sortOrder: 8}
                ]
        }
    ];

    ngOnInit() {
        this.showMasterOption(this.items[0].children[0]);
    }

    showMasterOption(item: any) {
        this.pageTitle = getTranslationString(`${item.key}.title`);
        this.entity = item.route;
        this.populateGrid();
    }

    createNew() {}

    populateGrid() {
        this.paramsSubscription = this.getList(this.coreState).subscribe(resp => {
            this.isLoading = false;
            this.gridData = resp.entities;
            this.gridOptions.total = resp.count;
            this.gridOptions.hasNext = resp.hasNext;
            this.gridOptions.hasPrevious = resp.hasPrevious;
        });
    }


    getList(queryOptions: MasterTypeQueryOptions): Observable<any>
    {
        return this.httpClient.get(this.masterUrl+`?${queryOptions.toQueryString()}`, this.requestHeaders).pipe
        (
            catchError(error => { return this.handleError(error, () => this.getList(queryOptions)); })
        );
    }

    ngOnDestroy() {
        this.paramsSubscription?.unsubscribe();
    }

    actionCb($event) {
    }

    updateGrid($event) {
    }

    moveToPage(pager: any) {
    }
}
