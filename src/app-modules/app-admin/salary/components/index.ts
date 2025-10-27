import {PaygradeComponent} from "./paygrade/paygrade.component";
import {SalaryComponent} from "./salary/salary.component";
import {SalaryHeadComponent} from "./salary-head/salary-head.component";
import {ResponsiveTablecomponent} from "./responsive-table/dashboard-table.component";
import {SalaryActionCellComponent} from "./grid-cell.component";
import {PayslipComponent} from "./payslip/payslip.component";

export const EMPLOYEE_SALARY_ENTRY_COMPONENT = [SalaryActionCellComponent];

export const EMPLOYEE_SALARY_COMPONENT = [ResponsiveTablecomponent, PaygradeComponent, SalaryHeadComponent, SalaryComponent, PayslipComponent];
