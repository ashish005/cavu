import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductLookupResolver} from "../../services/api.resolver";
import {ProductService} from "../../services/product.service";
import {of} from "rxjs";

@Component({
    selector: 'add-brand',
    templateUrl: './templates/add-brand.html',
  standalone: false
})
export class AddBrandComponent implements OnInit {
    customForm: FormGroup;
    submitted: boolean =  false;
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder, public apiResolver: ProductLookupResolver, private service: ProductService) {
        this.customForm = this.fb.group({
            name: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    ngOnInit(){ }

    saveForm(form, p){
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            p.close();
            this.cb.emit({  refresh: true });
        };
        const error = (resp)=> {
            this.submitted = false;
        };
        this.submitted = true;
        this.service.createBrand(form.value).subscribe(success, error);
    }
}
