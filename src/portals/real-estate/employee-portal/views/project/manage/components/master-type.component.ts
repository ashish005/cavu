import { Component, Injector, OnInit } from '@angular/core';
import { GridUISwitchCellComponent, CoreEndpointBase } from "@app-global";
import {Subscription, catchError, Observable} from "rxjs";
import {MasterTypeQueryOptions} from "../domains/master-type.domain";

const getTranslationString = (key)=> `master_type.project.${key}`;

@Component({
  standalone: false,
  templateUrl: './templates/master-type.html',
  styles: [`:host { display: contents;}`]
})
export class MasterTypeLayout extends CoreEndpointBase implements OnInit {
    pageTitle: string;
    public gridOptions: any = {
        header: { title: null, desc: null, add: true, refresh: true, edit: true, delete: false },
        total: 0,
        hasNext: false,
        hasPrevious: false,
        skip: 0,
        take: 25,
        columnDefs: []
    };
    gridData: Array<any>= [];
    coreState: MasterTypeQueryOptions = new MasterTypeQueryOptions();
    isLoading: boolean;
    paramsSubscription : Subscription;
    page: any;

    entity: string;
    get masterUrl() { return this.baseSectorAPIUrl + `projectMasterType/${this.entity}`; }

    constructor(public override injector: Injector){
        super(injector);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name'},
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }
    public items: Array<any> = [
        {
            id:3, icon:"fa fa-dashboard", isHeading: true, name: "Project", sortOrder: 3,
            children:
                [
                    {name: 'Project Type', route: 'projectType', key:'type', sortOrder: 1},
                    {name: 'Division', route: 'projectDivision', key:'division', sortOrder: 2},
                    {name: 'Resource Type', route: 'projectResourceType', key:'resource', sortOrder: 3},
                    {name: 'Project Status', route: 'projectStatus', key:'status', sortOrder: 4},
                    {name: 'Billing Type', route: 'projectBillingType', key:'billingType', sortOrder: 6}
                ]
        }
    ];

    ngOnInit() {
        this.showMasterOption(this.items[0].children[0]);
    }

    showMasterOption(item: any){
        this.pageTitle = getTranslationString(`${item.key}.title`);
        this.entity = item.route;
        this.populateGrid();
    }

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

    ngOnDestroy(){ this.paramsSubscription?.unsubscribe(); }
    actionCb($event){}
    updateGrid($event){}
    moveToPage(pager: any){}
    createNew() {}
}
