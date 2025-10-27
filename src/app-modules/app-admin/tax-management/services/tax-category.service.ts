import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {TaxCategory, TaxCategorySerializer} from "../domains/tax-category.serializer";

@Injectable()
export class TaxCategoryService extends OrgResourceService<TaxCategory>{
  constructor(public override injector: Injector) { super(injector, 'taxCategoryMaster', new TaxCategorySerializer()); }
}

/*@Injectable()
export class TaxGroupService extends CoreResourceService<TaxGroup>{
  constructor(public httpClient: HttpClient, public coreService: CoreService, public configurationService: ConfigurationService) {
    super(httpClient, coreService, configurationService.baseApiUrl, baseMasterType+'TaxGroup', new TaxGroupSerializer());
  }
}*/
