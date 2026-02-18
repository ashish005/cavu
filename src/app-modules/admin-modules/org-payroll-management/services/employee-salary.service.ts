import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global";
import {EmployeeSalary, EmployeeSalarySerializer} from "../domains/employee-salary.serializer";
import {SalaryHead, SalaryHeadSerializer} from "../domains/salary-head.serializer";
import {Paygrade, PaygradeSerializer} from "../domains/paygrade.serializer";
import {Salary, SalarySerializer} from "../domains/salary.serializer";
import {Payslip, PayslipSerializer} from "../domains/payslip.serializer";

@Injectable()
export class PaygradeService extends OrgResourceService<Paygrade>{
  portletId: number;
  constructor(override injector: Injector) { super(injector, 'salary/paygrade', new PaygradeSerializer()); }
}

@Injectable()
export class SalaryHeadService extends OrgResourceService<SalaryHead>{
  portletId: number;
  constructor(override injector: Injector) { super(injector, 'salary/head', new SalaryHeadSerializer()); }
}

@Injectable()
export class SalaryService extends OrgResourceService<Salary>{
  portletId: number;
  constructor(override injector: Injector) { super(injector,  'salary/list', new SalarySerializer()); }
}

@Injectable()
export class PayslipService extends OrgResourceService<Payslip>{
  portletId: number;
  constructor(override injector: Injector) { super(injector, 'salary/payslip', new PayslipSerializer()); }
}

@Injectable()
export class EmployeeSalaryService extends OrgResourceService<EmployeeSalary>{
  portletId: number;
  constructor(override injector: Injector) { super(injector, 'employee-salary', new EmployeeSalarySerializer()); }
}
