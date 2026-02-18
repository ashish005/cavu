import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {TaxManagement, TaxManagementSerializer} from "../domains/tax-management.serializer";

@Injectable()
export class TaxManagementService extends OrgResourceService<TaxManagement>{
  constructor(public override injector: Injector) { super(injector, 'taxManagement', new TaxManagementSerializer()); }
}
