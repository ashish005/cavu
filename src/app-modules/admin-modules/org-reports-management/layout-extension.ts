import {Component, Directive, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Directive()
export class LayoutExtension {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    page: any;
    public layout: any;
    public componentRef: any;
    public searchFilter: any;

    onActivate(componentRef){
        this.page = componentRef.activatedRoute.snapshot.data;
        this.componentRef = componentRef;
        if(this.searchFilter){
            if(componentRef.coreState.accountId){
                this.searchFilter.accountId = componentRef.coreState.accountId;
            }

            this.componentRef.searchActionCb(this.searchFilter);
        }
    }

    searchActionCb(row: any) {
        this.searchFilter = row;
        this.componentRef?.searchActionCb(row);
    }
}