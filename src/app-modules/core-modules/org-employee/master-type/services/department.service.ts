import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global";
import {DepartmentMaster, DepartmentMasterSerializer} from "../domains/department.serializer";

@Injectable()
export class DepartmentMasterService extends OrgResourceService<DepartmentMaster>{
  constructor(public override injector: Injector) { super(injector, 'masterType/department', new DepartmentMasterSerializer()); }
}
