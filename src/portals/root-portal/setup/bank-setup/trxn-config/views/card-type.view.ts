import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {PaymentCardType, PaymentCardTypeQueryOptions} from "../domains/card-type.serializer";
import {PaymentCardTypeService} from "../services/card-type.service";

@Component({
  standalone: false,
  templateUrl: './templates/card-type.html'
})
export class CardTypeView extends ViewExtender<PaymentCardType> implements OnInit{
  override coreState: PaymentCardTypeQueryOptions = new PaymentCardTypeQueryOptions();
  constructor(public override service: PaymentCardTypeService, public override activatedRoute: ActivatedRoute,){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Code', field: 'code' },
            {headerName: 'Name', field: 'name' },
            {headerName: 'Category', field: 'categoryName' },
            {headerName: 'Contactless', field: 'supportsContactless', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Online', field: 'supportsOnline', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Recurring', field: 'supportsRecurring', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Tokenization', field: 'supportsTokenization', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    actionCb(e){}
}
