import {ViewExtender} from "@app-global";
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
            {headerName: 'Name', field: 'name' }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    actionCb(e){}
}
