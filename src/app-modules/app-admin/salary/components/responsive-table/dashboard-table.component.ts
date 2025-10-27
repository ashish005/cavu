import {Component, Input} from "@angular/core";

@Component({
  selector: 'responsive-table',
  templateUrl: './dashboard-table.html'
})
export class ResponsiveTablecomponent {
  gridOptions: any = {
    columnDefs: []
  };
  loading = false;
  @Input() data: Array<any>;
  @Input() options: any;

  constructor() {}
}
