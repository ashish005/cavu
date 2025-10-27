import {Component, Input, OnInit} from "@angular/core";
import {ListLoaderComponent} from "@app-global";
import {PaygradeQueryOptions} from "../../domains/paygrade.serializer";
import {PaygradeService} from "../../services/employee-salary.service";

@Component({
  selector: 'paygrade',
  templateUrl: './paygrade.html'
})
export class PaygradeComponent extends ListLoaderComponent implements OnInit {
  title: string = "Paygrade";
  gridOptions: any = {};

  constructor(public service: PaygradeService) {
    super(service, new PaygradeQueryOptions());
  }

  ngOnInit() {
    this.gridOptions.columnDefs = [
      {headerName: 'Name', field: 'name'},
      {headerName: 'Salary Range', field: 'salaryRange'},
      {headerName: 'Paygrade Post', field: 'paygradePost'}
    ];
    this.callService(this.queryOption);
  }
}
