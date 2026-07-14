import { Component, EventEmitter, Output } from "@angular/core";
import { DynamicComponent } from "@app-global";
import {QuotationService} from "../services/quote.service";

@Component({
  standalone: false,
    templateUrl: './templates/voucher-phase-change.html'
})
export class QuotePhaseChangeActionCell extends DynamicComponent{
    constructor(private service: QuotationService){ super(); }
    callback =()=> this.service.$refreshCb.emit(true);
}
