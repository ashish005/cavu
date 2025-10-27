import {
    Component,
    EventEmitter,
    Input, OnDestroy,
    OnInit,
    Output
} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {PaymentGatewayLookupAPIResolver} from "../services/api.resolver";
import {PaymentGatewayServiceChargeForm} from "../forms/payment-gateway-service-charge.form";
import {Subscription} from "rxjs";
import {PaymentGatewayChargeService} from "../services/payment-gateway-charges.service";
import {PaymentGateway} from "../domains/payment-gateway.serializer";
import {CardTypeLookup, ModeGatewayMapperLookup} from "../domains/lookup.serializer";
import {ServiceCharge} from "../domains/gateway-service-charge.serializer";

@Component({
    templateUrl: './templates/service-charge-ce.html',
    styles:[`:host { display: contents; }`]
})
export class ServiceChargeCeComponent extends PaymentGatewayServiceChargeForm implements OnInit {
    submitted: boolean = false;
    subscribe: Subscription;
    gateway: PaymentGateway;
    cardType: CardTypeLookup;
    @Input() mapperId;
    @Input() modeMapper: ModeGatewayMapperLookup;


    @Input() set data(item: PaymentGateway) { this.gateway = item; }
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public fb: FormBuilder,
                public apiResolver: PaymentGatewayLookupAPIResolver,
                public service: PaymentGatewayChargeService){
        super(fb);
    }

    showCardTypes(cardType: CardTypeLookup){
        this.cardType = cardType;
        this.fetchCharges();
    }

    addCharges() {
        this.formGatewayServiceCharges.push(this.formGatewayServiceCharge(new ServiceCharge({
            id: null,
            //gatewayId: this.gatewayId,
            //modeId: this.modeId,
            mapperId: this.mapperId,
            cardTypeId: this.cardType?.id,
            cardTypeName: this.cardType?.name,
            serviceChargeRate: 0,
            taxRate: 0,
            trxnAmountFrom: 0,
            trxnAmountTo: 0,
            status: true
        })));
    }

    ngOnInit() { this.fetchCharges(); }

    fetchCharges() {
        let param = `${this.mapperId}`;
        if(this.gateway.isPOS && this.cardType?.id) {
            param += `/${this.cardType.id}`;
        } else {
            param += `/0`;
        }
        const success =(resp)=> {
            this.formGatewayServiceCharges.controls.length = 0;
            (resp.entities || []).map(r => { this.addGatewayServiceCharge(r); });
        };
        this.service.read(param).toPromise().then(success);
    }

    ngOnDestroy(){this.subscribe?.unsubscribe();}

    applyCharges(form: FormGroup){
        const data = form.getRawValue();
        data.status = (data.status)? 1: 2;
        this.submitted = true;

        form.disable();
        const success =(resp)=> {
            form.enable();
            if(resp?.data) { form.get('id').setValue(resp.data.id); }
            this.submitted = false;
        };
        const failure =(err)=> {
            form.enable();
            this.submitted = false;
        };

        if(data.id){
            this.subscribe = this.service.update(data.id, data).subscribe(success, failure);
        } else {
            this.subscribe = this.service.create(data).subscribe(success, failure);
        }
    }
}