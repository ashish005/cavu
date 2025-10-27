import {
    ViewChild,
    ViewContainerRef,
    Directive,
    OnInit,
    OnDestroy,
    TemplateRef,
    ElementRef,
    Input,
    EventEmitter, Output
} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CoreQueryOptions, OrgResourceService} from "@app-global";
import {Subscription} from "rxjs";

export enum Task_Action {
  Add = "Add",
  Update = "Update",
}

@Directive()
export class AccordianViewExtender<T> {
    @ViewChild('titleTemplate', { static: true }) public titleTemplate: TemplateRef<any>;
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    gridOptions: any = {
        header: { title: 'Org Process', desc: 'Org Process information here', add: true, refresh: true, edit: true, delete: false },
        total: 0,
        hasNext: false,
        hasPrevious: false,
        isOrderable: false,
        columnDefs: [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Description', field: 'description' }
        ],
        rowComponent: null,
        detailComponent: null
    };
    gridData: Array<T>= [];
    gridRow: T;
    otherData: any;
    submitted: boolean = false;
    isLoading: boolean = false;
    paramsSubscription : Subscription;
    subjectSubscription : Subscription;
    page: any;
    constructor(public service: OrgResourceService<any>, public coreState: CoreQueryOptions, public activatedRoute: ActivatedRoute) {
        this.page = this.activatedRoute.snapshot.data;
    }

    ngOnDestroy(){
        this.paramsSubscription?.unsubscribe();
        this.subjectSubscription?.unsubscribe();
    }

    refreshGrid($event){ this.populateGrid(); }
    populateGrid() {this.updateGrid(this.coreState);}
    updateGrid(_coreState) {
        this.isLoading = true;
        const success = (resp: any) => {
            this.isLoading = false;
            this.gridData = resp.entities;
            this.otherData = resp.data;
            this.gridOptions.total = resp.count;
            this.gridOptions.hasNext = resp.hasNext;
            this.gridOptions.hasPrevious = resp.hasPrevious;
        };
        this.paramsSubscription = this.service.list(_coreState).subscribe(success);
    }

    checkValue(row: any){ row.isChecked = !row.isChecked; }
    checkUncheckAll(){}
    moveToPage(pager: any){
        this.coreState.skip = pager.skip;
        this.coreState.take = pager.take;
        this.updateGrid(this.coreState);
    }

    /*editRecord(row: any){
        const inputData: any = {
            header: { text: `Edit: ${row.name}`, desc: '' },
            id: row.id,
            data: row,
            otherData: this.otherData,
            service: this.service
        };

        this.cb.emit(inputData);
    }

    addRecord(){
        const inputData: any = {
            header: { text: ACTION_ENUM.ADD, desc: '' },
            service: this.service,
            id: null,
            data: null,
            otherData: this.otherData
        };
        this.cb.emit(inputData);
    }

    remove(row: any){
        const inputData: any = {
            header: { text: ACTION_ENUM.DELETE, desc: '' },
            service: this.service,
            id: row.id,
            data: row,
            otherData: this.otherData,
            actionType: ACTION_ENUM.DELETE
        };
        this.cbRemove.emit(inputData);
    }*/
    /*boxToolCallback(key){
        if(key == ACTION_ENUM.ADD){
            this.addRecord();
        } else if(key == ACTION_ENUM.REFRESH){
            this.updateGrid(this.coreState);
        }
    }*/
}
