import {CreateEditBusinessView} from "./create-edit-business.component";
import {BusinessPermissionInfo, BusinessContactGridCell, BusinessCell} from "./grid.cell.component";
import {OrgModulePermissionComponent} from "./module-permission.component";
import {ModulePermissionGridComponent} from "./module-permission-grid.component";

export {CreateEditBusinessView} from "./create-edit-business.component";

export const BUSINESS_COMPONENT = [CreateEditBusinessView, OrgModulePermissionComponent, ModulePermissionGridComponent, BusinessCell];
export const BUSINESS_ENTRY_COMPONENT = [BusinessPermissionInfo, BusinessContactGridCell];