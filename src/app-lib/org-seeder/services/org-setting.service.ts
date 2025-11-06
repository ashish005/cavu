import {Injectable, Injector} from "@angular/core";
import {Observable, throwError, catchError, map, tap, flatMap} from "rxjs";
import {OrgResourceService} from "../../../app/global/services";
import {OrgSetting, OrgSettingSerializer} from "../domains/org-setting.serializer";

@Injectable()
export class OrgSettingService extends OrgResourceService<OrgSetting> {
    constructor(public override injector: Injector) {
        super(injector, 'orgSetting', new OrgSettingSerializer());
    }

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

    orgSettingEndpoint(orgSettingId, data)
    {
        return this.httpClient.put(`${this.viewUrl}/partial/${orgSettingId}`, data, this.requestHeaders)
            .pipe(
                tap(
                    (r)=> r,
                    (error)=>{ this.handleError(error, () => this.orgSettingEndpoint(orgSettingId, data)) }
                )
            );
    }
    // Sector api sync
    // updateOrgSectorSettingEndpoint(data)
    // {
    //     return this.httpClient.post(`${this.baseSectorAPIUrl}orgConfig/lookup/default`, data, this.requestHeaders)
    //         .pipe(
    //             tap(
    //                 (r)=> r,
    //                 (error)=>{ this.handleError(error, () => this.updateOrgSectorSettingEndpoint(data)) }
    //             )
    //         );
    // }

    // Sector api sync
    // updateOrgConfigSettings(data)
    // {
    //     return this.httpClient.post(`${this.baseSectorAPIUrl}orgConfig/lookup/default`, data, this.requestHeaders);
    // }

    seederOrgBranchAsync = (orgBranchId) => this.applySeed(orgBranchId, 'master');
    seederOrgBranchDemo = (orgBranchId) => this.applySeed(orgBranchId, 'demo');

    private applySeed = (orgBranchId, moduleMasterType): Observable<any> => {
        const { id, businessMasterType, softwareCode, orgConfig} = super.orgSetup;
        const {
            countryCode, timeZone, currencyCode, cultureCode
        } = orgConfig;

        const reqBody = {
            orgBranchId: orgBranchId,
            orgUnitId: id,
            timeZone: timeZone,
            countryCode: countryCode,
            currencyCode: currencyCode,
            cultureCode: cultureCode,
            module: moduleMasterType,

            //sectorMasterType: sectorMasterType,
            businessMasterType: businessMasterType,
            SoftwareCode: softwareCode
        };

        const success = ()=> {
            // return this.httpClient
            //   .put(this.baseAPIUrl+`tenantSeeder/success`, {orgBranchId: orgBranchId}, this.requestHeaders)
        }
        return this.httpClient.post(`${this.baseSectorAPIUrl}/seed/tenant`, reqBody, this.requestHeaders).pipe(
            //flatMap((res) => success()),
            catchError(error => this.handleError(error, () => this.applySeed(orgBranchId, moduleMasterType)))
        );
    };
}