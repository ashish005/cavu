import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceRequestAPIResolver} from "../../services/api.resolver";

@Component({
  standalone: false,
  selector: 'activity',
  templateUrl: './activity.html'
})
export class ActivityComponent {
  constructor(public fb: FormBuilder, public apiResolver: ServiceRequestAPIResolver) {
  }
}
