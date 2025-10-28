import {Component, Input, OnInit} from "@angular/core";
import {ListLoaderComponent} from "@app-global";
import {SalaryQueryOptions} from "../../domains/salary.serializer";
import {SalaryService} from "../../services/employee-salary.service";
import {SalaryActionCellComponent} from "../grid-cell.component";

@Component({
    standalone: false,
  selector: 'salary',
  templateUrl: './salary.html'
})
export class SalaryComponent extends ListLoaderComponent implements OnInit {
  gridOptions: any = {};

  constructor(public override service: SalaryService) {
    super(service, new SalaryQueryOptions());
  }

  ngOnInit() {
    this.gridOptions.columnDefs = [
      {headerName: 'Month', field: 'duration'},
      {headerName: 'Employee Name', field: 'name'},
      {headerName: 'Code', field: 'code'},
      {headerName: 'Post', field: 'post'},
      {headerName: 'Salary', field: 'calculationType'},
      {headerName: 'Deduction', field: 'deduction'},
      {headerName: 'Net Salary', field: 'netSalary'},
      {headerName: 'Action', cellTemplate: SalaryActionCellComponent}
    ];
    this.callService(this.queryOption);
  }
}
