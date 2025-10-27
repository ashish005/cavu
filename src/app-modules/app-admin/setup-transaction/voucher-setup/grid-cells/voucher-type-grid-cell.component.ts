import {Component, Input, OnInit} from "@angular/core";
import {DynamicComponent} from "@app-global";

@Component({
  standalone: false,
    templateUrl: './templates/voucher-type-grid-cell.html'
})
export class VoucherTypePhaseCellComponent extends DynamicComponent {
    constructor() {
        super();
    }
}
