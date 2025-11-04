import {Injectable, Injector} from "@angular/core";
import { CoreResourceService } from "@app-global";
import {ModulePermission, ModulePermissionSerializer} from "../domains/module-permission.serializer";

@Injectable()
export class ModulePermissionService extends CoreResourceService<ModulePermission>
{
  constructor(public override injector: Injector) { super(injector, 'tenant', new ModulePermissionSerializer()); }

  public get orgPermissionUrl (){ return `${this.baseAPIUrl}orgPermission`; }

    getModulesByLicense(licenseMasterType)
    {
        const { sectorMasterType, id } = this.orgSetup;

        let url = `${this.orgPermissionUrl}/${sectorMasterType}/${id}`;
        if(licenseMasterType) {
            url += `/${licenseMasterType}`;
        }

        return this.httpClient.get(`${url}`, this.requestHeaders).toPromise();
    }

    updateBusinessPermissionModules(items)
    {
        const { id } = this.orgSetup;
        return this.httpClient.patch(`${this.orgPermissionUrl}/${id}`, items, this.requestHeaders).toPromise();
    }

    updatePermissionModulesByLicenseType(licenseType: string, licenseTypeId: string)
    {
        const { sectorMasterType, id } = this.orgSetup;
        const data = {
            id: licenseTypeId,
            licenseType: licenseType
        };
        return this.httpClient.patch(`${this.orgPermissionUrl}/${sectorMasterType}/${id}`, data, this.requestHeaders).toPromise();
    }
}
