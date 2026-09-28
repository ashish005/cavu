import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {BankIdentifierType, BankIdentifierTypeQueryOptions} from "../domains/bank-identifier-type.serializer";
import {BankIdentifierTypeService} from "../services/bank-identifier-type.service";

@Component({
  standalone: false,
  templateUrl: './templates/card-type.html'
})
export class BankIdentifierTypeView extends ViewExtender<BankIdentifierType> implements OnInit{
  override coreState: BankIdentifierTypeQueryOptions = new BankIdentifierTypeQueryOptions();
  constructor(public override service: BankIdentifierTypeService, public override activatedRoute: ActivatedRoute,){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Code', field: 'code' },
            {headerName: 'Name', field: 'name' },
            {headerName: 'Countries', field: 'countryCount' },
            {headerName: 'Required Countries', field: 'requiredCountryCount' },
            {headerName: 'Active Rules', field: 'activeRuleCount' },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    actionCb(e){}
}
