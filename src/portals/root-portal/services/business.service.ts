import {Injectable, Injector} from "@angular/core";
import {Business, BusinessQueryOptions, BusinessSerializer} from "../domains/business.serializer";
import { CoreResourceService } from "@app-global";

@Injectable()
export class BusinessService extends CoreResourceService<Business>{
  constructor(public override injector: Injector) { super(injector, 'tenant', new BusinessSerializer());}
}
