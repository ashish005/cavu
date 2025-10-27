import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ViewExtender} from "@app-global";
import {Executive, ExecutiveQueryOptions} from "../domains/executive.serializer";
import {ExecutiveService} from "../services/executive.service";

@Component({
    styles: [`:host { display: contents;}`],
    templateUrl: './templates/default-view.html',
    standalone: false
})
export class ExecutiveManageView extends ViewExtender<Executive> implements OnInit {
    lookups: any;
    header: any = { text: 'Executive', options:[] };
    override coreState: ExecutiveQueryOptions = new ExecutiveQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: ExecutiveService) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'fName' },
            {headerName: 'Can Login', field: 'hasLoginAccount' }
        ];
    }

    ngOnInit(){
        //const { id} = <LoginUser>this.coreService.currentUser;
        //this.coreState.orgUserId = id;
        super.populateGrid();
    }

    createNew(){}
    actionCb(row: Executive){}
}
