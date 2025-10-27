import {CreateEditBusinessView} from "./create-edit-business.component";
import {BusinessPermissionInfo, BusinessContactGridCell} from "./grid.cell.component";
import {OrgModulePermissionComponent} from "./module-permission.component";

export {CreateEditBusinessView} from "./create-edit-business.component";

export const BUSINESS_COMPONENT = [CreateEditBusinessView, OrgModulePermissionComponent];
export const BUSINESS_ENTRY_COMPONENT = [BusinessPermissionInfo, BusinessContactGridCell];