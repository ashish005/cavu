import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Associate, AssociateQueryOptions} from "../domains/associate.serializer";
import {AssociateService} from "../services/associate.service";
import {ViewExtender} from "@app-global";

@Component({
  standalone: false,
    templateUrl: './templates/default-view.html',
    styles: [`:host { display: contents;}`]
})
export class AssociateManageView extends ViewExtender<Associate> implements OnInit, OnDestroy {
    lookups: any;
    header: any = { text: 'Executive', options:[] };
    override coreState: AssociateQueryOptions = new AssociateQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute, public override service: AssociateService) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'First Name', field: 'fName' },
            {headerName: 'Last Name', field: 'lName' },
            {headerName: 'Email', field: 'email' },
            {headerName: 'Phone', field: 'phone' },
            {headerName: 'Relation', field: 'relationType' },
            {headerName: 'Is Primary', field: 'isPrimary' }
        ];
    }

    ngOnInit(){
        // const { id } = <LoginUser>this.coreService.currentUser;
        // (<any>this.coreState).orgUserId = id;
        super.populateGrid();
    }

    override ngOnDestroy(){ super.ngOnDestroy();}

    createNew(){}
    actionCb(row: Associate){}
}
