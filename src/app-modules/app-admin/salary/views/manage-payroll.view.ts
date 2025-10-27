import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './templates/manage-payroll.html'
})
export class EmployeeManagePayrollView {
  constructor(public router: Router,
              private activeRoute: ActivatedRoute) {
  }
}
