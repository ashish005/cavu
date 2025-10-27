import {Injectable, Injector} from "@angular/core";
import { Observable, throwError, catchError, map, tap } from "rxjs";
import { OrgResourceService } from "@app-global";
import {OrgSetting, OrgSettingSerializer} from "../domains/org-setting.serializer";

@Injectable()
export class OrgSettingService extends OrgResourceService<OrgSetting> {
    constructor(public override injector: Injector) { super(injector, 'orgSetting', new OrgSettingSerializer()); }

    updateGeneralOrgConfig(unitConfigId, data){
        const viewUrl = `${this.viewUrl}/${unitConfigId}/general`;
        return this.httpClient
            .patch(viewUrl, data, this.requestHeaders)
            .pipe(
                catchError(error => this.handleError(error, () => this.updateGeneralOrgConfig(unitConfigId, data)))
            );
    }

    updateUnitConfigSetup(unitConfigId, data)
    {
        const viewUrl = `${this.viewUrl}/${unitConfigId}/setup`;
        return this.httpClient.patch(viewUrl, data, this.requestHeaders)
            .pipe(
                tap(
                    (error)=>{ this.handleError(error, () => this.updateUnitConfigSetup(unitConfigId, data)) }
                )
            );
    }

    // Sector api sync
    // updateOrgConfigSettings(data)
    // {
    //     return this.httpClient.post(`${this.baseSectorAPIUrl}orgConfig/lookup/default`, data, this.requestHeaders);
    // }
}
