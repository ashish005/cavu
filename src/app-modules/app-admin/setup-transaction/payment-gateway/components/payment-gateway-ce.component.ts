import {
    Component,
    EventEmitter,
    Input, OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {PaymentGatewayForm} from "../forms/payment-gateway.form";
import {PaymentGatewayLookupAPIResolver} from "../services/api.resolver";
import {pairwise, startWith, Subscription} from "rxjs";
import {ACTION_ENUM} from "@app-global";
import {PaymentGatewayService} from "../services/payment-gateway.service";

@Component({
    templateUrl: './templates/payment-gateway-ce.html',
    styles:[`:host { display: contents; }`]
})
export class PaymentGatewayCeComponent extends PaymentGatewayForm implements  OnInit, OnDestroy {
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    @Input() id: string;


    get actionType() { return this.id? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

    submitted: boolean = false;
    customForm: FormGroup;

    //modes: Array<PaymentModeLookup> = [];
    subscribe: Subscription;

    @Input() set data(val){
        super.populateForm(val);
    };
    constructor(public override fb: FormBuilder, public apiResolver: PaymentGatewayLookupAPIResolver, public service: PaymentGatewayService){
        super(fb);
        /*const itemFormValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next) { this.modes = this.apiResolver.masterType.getModesBySystemTypeId(next); }
        };
        this.formSystemTypeId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormValueChange);*/
    }

    ngOnInit(){

    }

    onSubmit(form) {
        // stop here if form is invalid
        if (form.invalid) { return; }
        this.submitted = true;
        const success =(resp)=> {
            this.submitted = false;
            this.onOk.emit(true);
        };
        const failure =(err)=> {
            this.submitted = false;
        };

        const data = form.getRawValue();

        for (let item of data.modeGatewayMapper) {
            item.status = (item.status) ? 'Active': 'InActive';
        }
        if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
            this.subscribe = this.service.update(this.id, data).subscribe(success, failure);
        } else if(this.actionType == ACTION_ENUM.ADD) {
            this.subscribe = this.service.create(data).subscribe(success, failure);
        }
    }

    ngOnDestroy(){this.subscribe?.unsubscribe();}
}
