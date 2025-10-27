import {FormBuilder, FormGroup} from "@angular/forms";
import {Component, Input} from "@angular/core";

@Component({
  standalone: false,
    selector: '[attribute-row]',
    templateUrl: `./templates/attribute-row.html`
})
export class ProductAttributeRowComponent {
    @Input() customForm: FormGroup;
    constructor(public fb: FormBuilder) {}
}
