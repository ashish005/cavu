import {Component, Input, OnInit} from "@angular/core";
import {ListLoaderComponent} from "@app-global";
import {PayslipQueryOptions} from "../../domains/payslip.serializer";
import {PayslipService} from "../../services/employee-salary.service";

@Component({
    standalone: false,
  selector: 'payslip',
  templateUrl: './payslip.html'
})
export class PayslipComponent extends ListLoaderComponent implements OnInit {
  gridOptions: any = {};

  constructor(public override service: PayslipService) {
    super(service, new PayslipQueryOptions());
  }

  ngOnInit() {
    this.gridOptions.columnDefs = [
      {headerName: 'Earning', field: 'earning'},
      {headerName: 'Earning Amount', field: 'amount'},
      {headerName: 'Deduction', field: 'deduction'},
      {headerName: 'Deduction Amount', field: 'deductionAmount'}
    ];
    this.callService(this.queryOption);
  }
}
