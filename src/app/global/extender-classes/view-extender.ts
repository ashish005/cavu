import {Directive, OnDestroy, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {CoreQueryOptions, CoreResponse} from "../services/models/core-resource";
import {OrgResourceService, CoreResourceService} from "../services/endpoint-base.service";

//export enum GridAction { Add = "Save", Update = "Update" }
@Directive()
export class ViewExtender<T> {
    public pageTitle: string;
    public desc: string;
    public pageIcon: string;
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
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
    public gridRow: T;
    gridOtherData: any;
    //pageAction: GridAction;
    //submitted: boolean = false;
    //id: string;

    isLoading: boolean = false;
    hasError: boolean;
    errorMsg: string;
    public paramsSubscription : Subscription;
    public subjectSubscription : Subscription;
    protected coreState: CoreQueryOptions;
    constructor(protected activatedRoute: ActivatedRoute, protected service: OrgResourceService<any> | CoreResourceService<any>){
        const { data, parent} = activatedRoute.snapshot || {};
        this.pageTitle = data['header'] || parent?.data['header'];
        this.pageIcon = data['icon'] || parent?.data['icon'];
        this.desc = data['title'] || parent?.data['desc'];
    }

    ngOnDestroy(){
        this.paramsSubscription?.unsubscribe();
        this.subjectSubscription?.unsubscribe();
    }

    populateGrid<T>() {
        this.updateGrid<T>(this.coreState);
    }

    updateGrid<T>(_coreState) {
        this.isLoading = true;
        this.paramsSubscription = this.service.list(_coreState).subscribe((resp: CoreResponse<T>) => {
            this.isLoading = false;
            this.hasError = !resp.isSuccess;
            this.errorMsg = resp.message;

            this.gridOtherData = resp.data;
            this.gridData = resp.entities;
            this.gridOptions.total = resp.count;
            this.gridOptions.hasNext = resp.hasNext;
            this.gridOptions.hasPrevious = resp.hasPrevious;

        }, err=> { this.isLoading = false; this.errorMsg = err; });
    }

    moveToPage(pager: any){
        this.coreState.skip = pager.skip;
        this.coreState.take = pager.take;
        this.updateGrid(this.coreState);
    }

    refreshGrid = () => { this.populateGrid(); }
    //actionCb(row: any){}
    actionRemoveCb(e){}
}
