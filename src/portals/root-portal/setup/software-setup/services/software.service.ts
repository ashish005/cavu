import {Injectable, Injector} from "@angular/core";
import { OrgResourceService } from "@app-global";
import {SoftwarePrice, SoftwarePriceSerializer} from "../domains/software.serializer";
import {ModulePermission, ModulePermissionSerializer} from "../domains/module-permission.serializer";

@Injectable()
export class SoftwarePlanService extends OrgResourceService<SoftwarePrice>{
    constructor(public override injector: Injector) {
        super(injector, 'v1/global/software', new SoftwarePriceSerializer());
    }
}

@Injectable()
export class SoftwareModulesService extends OrgResourceService<ModulePermission>{
    constructor(public override injector: Injector) {
        super(injector, 'v1/global/software/modules', new ModulePermissionSerializer());
    }
}

// @Injectable()
// export class PricingService extends OrgResourceService<SoftwarePrice>{
//     constructor(public override injector: Injector) { super(injector, 'v1/software', new SoftwarePriceSerializer());}
//     public getPlans = (softwareId: any) => this.httpClient.get(`${this.viewUrl}/plans/${softwareId}`, this.requestHeaders);
//     public getModules = (softwareId) => this.httpClient.get(`${this.viewUrl}/${softwareId}/modules`, this.requestHeaders);
// }