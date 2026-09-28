import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {BankAccountType, BankAccountTypeQueryOptions} from "../domains/bank-account-type.serializer";
import {BankAccountTypeService} from "../services/bank-account-type.service";

@Component({
  standalone: false,
  templateUrl: './templates/card-type.html'
})
export class BankAccountTypeView extends ViewExtender<BankAccountType> implements OnInit{
  override coreState: BankAccountTypeQueryOptions = new BankAccountTypeQueryOptions();
  constructor(public override service: BankAccountTypeService, public override activatedRoute: ActivatedRoute,){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Code', field: 'code' },
            {headerName: 'Name', field: 'name' },
            {headerName: 'Business', field: 'isBusiness', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Personal', field: 'isPersonal', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Incoming', field: 'supportsIncoming', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Outgoing', field: 'supportsOutgoing', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'DirectDebit', field: 'supportsDirectDebit', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Interest', field: 'supportsInterest', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    actionCb(e){}
}
