import { CoreResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {OrgLicenseHistory, OrgLicenseHistorySerializer} from "../domains/org-license-history.serializer";

@Injectable()
export class OrgLicenseHistoryService extends CoreResourceService<OrgLicenseHistory>{
    constructor(public override injector: Injector) { super(injector, 'licenseHistory', new OrgLicenseHistorySerializer()); }
}
