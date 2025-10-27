import {FormBuilder, FormGroup} from "@angular/forms";
import {Component, Input} from "@angular/core";
import {ProductLookupResolver} from "../services/api.resolver";

@Component({
    selector: '[attribute-row]',
    templateUrl: `./templates/attribute-row.html`,
  standalone: false
})
export class ProductAttributeRowComponent {
    @Input() customForm: FormGroup;
    constructor(public fb: FormBuilder, public apiResolver: ProductLookupResolver) {}
}
