import {Component, Input, OnInit} from "@angular/core";
import {ListLoaderComponent} from "@app-global";
import {SalaryHeadQueryOptions} from "../../domains/salary-head.serializer";
import {SalaryHeadService} from "../../services/employee-salary.service";

@Component({
  selector: 'salary-head',
  templateUrl: './salary-head.html'
})
export class SalaryHeadComponent extends ListLoaderComponent implements OnInit {
  title: string = "Salary Head";
  gridOptions: any = {};

  constructor(public service: SalaryHeadService) {
    super(service, new SalaryHeadQueryOptions());
  }

  ngOnInit() {
    this.gridOptions.columnDefs = [
      {headerName: 'Head', field: 'name'},
      {headerName: 'Code', field: 'code'},
      {headerName: 'Calculation Type', field: 'calculationType'},
      {headerName: 'Deduction Allowed', field: 'isDeduction'},
      {headerName: 'Formula', field: 'formula'}
    ];
    this.callService(this.queryOption);
  }
}
