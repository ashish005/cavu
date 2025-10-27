import {EmployeeMasterTypeAPIResolver} from "./api.resolver";
import {LeaveGroupService, LeaveTypeService} from "./leave.service";
import {DepartmentMasterService} from "./department.service";
import {PostMasterService} from "./post.service";
import {DutyMasterService} from "./duty.service";
import {GradeMasterService} from "./grade.service";


export {LeaveGroupService, LeaveTypeService} from "./leave.service";

export {DepartmentMasterService} from "./department.service";
export {PostMasterService} from "./post.service";
export {DutyMasterService} from "./duty.service";
export {GradeMasterService} from "./grade.service";
export {EmployeeMasterTypeAPIResolver} from "./api.resolver";

export const EMP_MASTER_SERVICES = [
    EmployeeMasterTypeAPIResolver,
    LeaveGroupService, LeaveTypeService,
    DepartmentMasterService, PostMasterService, DutyMasterService, GradeMasterService,
];