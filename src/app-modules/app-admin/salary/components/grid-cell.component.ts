import {Component} from "@angular/core";
import {DynamicComponent} from "@app-global";

@Component({
  template: `<a>Manage</a><a>Payment</a><a>Payslip</a>`
})
export class SalaryActionCellComponent extends DynamicComponent{
  update($event){
    if(this.context.isMasterData){
      return false;
    }
  }
}
