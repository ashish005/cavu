import {EventEmitter, Injectable, Injector, Output} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {Quotation, QuotationSerializer} from "../domains/quotation.serializer";

@Injectable()
export class QuotationService extends OrgResourceService<Quotation>{
  $refreshCb: EventEmitter<any> = new EventEmitter<any>();
  constructor(public override injector: Injector) { super(injector, 'quotation', new QuotationSerializer()); }
}
