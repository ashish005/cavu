import {Injectable, Injector} from "@angular/core";
import {DashboardPortlet, DashboardPortletSerializer} from "../domains/dashboard-portlet.serializer";
import { OrgResourceService } from "@app-global";

@Injectable()
export class DashboardPortletService extends OrgResourceService<DashboardPortlet>{
    constructor(public override injector: Injector) {
      super(injector, 'dashboardPortlet', new DashboardPortletSerializer());
    }
}
