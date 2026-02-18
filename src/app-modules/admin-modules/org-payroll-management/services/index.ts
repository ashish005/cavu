import {EmployeeSalaryAPIResolver} from "./api.resolver";
import {EmployeeSalaryService, PaygradeService, SalaryHeadService, SalaryService, PayslipService} from "./employee-salary.service";

export const EMPLOYEE_SALARY_SERVICE = [
  EmployeeSalaryAPIResolver,
  EmployeeSalaryService,
  PaygradeService,
  SalaryHeadService,
  SalaryService,
  EmployeeSalaryService,
  PayslipService
];
