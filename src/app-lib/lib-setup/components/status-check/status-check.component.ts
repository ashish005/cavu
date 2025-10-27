import {Component, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";
export enum STATUS_ENUM { ACTIVE = 1, INACTIVE = 2 };

@Component({
  selector: 'status-check',
  templateUrl: './status-check.html', standalone: false
})
export class StatusCheckComponent {
  status = STATUS_ENUM;
  @Input() customForm: FormGroup;

  get f() { return this.customForm.controls; }
  get formIsActive() { return this.customForm.get('isActive'); }
  // get formStatus() { return this.customForm.get('status'); }
  //
  //   onStatusChange() {
  //       this.formStatus.setValue( this.formIsActive.value? STATUS_ENUM.ACTIVE: STATUS_ENUM.INACTIVE);
  //       // Perform actions based on the new selected value
  //   }
}
