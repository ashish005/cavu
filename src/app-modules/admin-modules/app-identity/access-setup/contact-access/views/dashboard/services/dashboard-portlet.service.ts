import {Injectable, Injector} from "@angular/core";
import {DashboardPortlet, DashboardPortletSerializer} from "../domains/dashboard-portlet.serializer";
import { CoreResourceService } from "@app-global";

@Injectable()
export class DashboardPortletService extends CoreResourceService<DashboardPortlet>{
    constructor(public override injector: Injector) {
      super(injector, 'dashboardPortlet', new DashboardPortletSerializer());
    }
}
