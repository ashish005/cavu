import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {ACTION_ENUM} from "@app-global";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductTokenForm} from "../forms/product-token-form";
import {ProductToken} from "../domains/token.serializer";
import {ProductTokenService} from "../services/product.service";
import {ProductLookupResolver} from "../../common";

@Component({
  standalone: false,
    templateUrl: `./templates/product-token-ce.html`,
    styles: [`:host { display: contents;}`]
})
export class ProductTokenCEComponent extends ProductTokenForm implements OnInit{
    get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
    @Input() id: any;
    @Input() set data(item: ProductToken) {
        super.populateProductToken(item || new ProductToken());
    };
    submitted: boolean = false;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    constructor(public override fb: FormBuilder, public apiResolver: ProductLookupResolver, private service: ProductTokenService) {
        super(fb);
    }

    ngOnInit(){}

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) {
            return;
        }
        const success = (resp)=> {
            this.submitted = false;
            this.onOk.emit(resp);
        };
        const error = (resp)=> {
            this.submitted = false;
        };
        this.submitted = true;
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.service.update(this.id, form.value).subscribe(success, error);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.service.create(form.value).subscribe(success, error);
        }
    }
}
