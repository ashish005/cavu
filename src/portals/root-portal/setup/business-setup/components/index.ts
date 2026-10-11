import {CreateEditBusinessView} from "./create-edit-business.component";
import {BusinessCell, BusinessNameCell, OrgBranchNameCell} from "./grid.cell.component";
import {OrgModulePermissionComponent} from "./module-permission.component";
import {ModulePermissionGridComponent} from "./module-permission-grid.component";
import {OrgBranchesComponent} from "./org-branches.component";

export {CreateEditBusinessView} from "./create-edit-business.component";

export const BUSINESS_COMPONENT = [
    CreateEditBusinessView, OrgModulePermissionComponent, ModulePermissionGridComponent,
    OrgBranchesComponent,
    BusinessNameCell, BusinessCell, OrgBranchNameCell
];
export const BUSINESS_ENTRY_COMPONENT = [];