import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";
import {SoftwarePrice, SoftwarePriceSerializer} from "../domains/org-software-license.serializer";

@Injectable()
export class PricingService extends OrgResourceService<SoftwarePrice>{
  constructor(public override injector: Injector) { super(injector, 'v1/software', new SoftwarePriceSerializer());}
  public getPlans = (softwareId: any) => this.httpClient.get(`${this.viewUrl}/plans/${softwareId}`, this.requestHeaders);
  public getModules = (softwareId) => this.httpClient.get(`${this.viewUrl}/${softwareId}/modules`, this.requestHeaders);
}