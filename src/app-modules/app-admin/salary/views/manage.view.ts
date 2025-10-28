import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeSalaryAPIResolver} from "../services/api.resolver";

@Component({
    standalone: false,
  templateUrl: './templates/manage.html'
})
export class
EmployeeSalaryManageView {
  constructor(public apiResolver: EmployeeSalaryAPIResolver,
              public router: Router,
              private activeRoute: ActivatedRoute) {
  }
}
