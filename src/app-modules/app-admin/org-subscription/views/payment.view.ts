import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {PaymentSoftware, PaymentSoftwareLicenseType} from "../domains/payment.lookup";
import {Subscription} from "rxjs";
import {PaymentService} from "../services/payment.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    templateUrl: './templates/payment.html'
})
export class PaymentView implements OnInit, OnDestroy {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    software: PaymentSoftware;
    isLoading: boolean = false;
    subscriber: Subscription;
    submitted: boolean = false;

    activeLicenseType:  PaymentSoftwareLicenseType;
    planType: string = 'monthly';
    paymentModes = [
        { id: 1, name: 'Credit Card', key: 'credit_card' },
        { id: 2, name: 'Debit Card', key: 'debit_card' },
        { id: 3, name: 'UPI', key: 'upi' },
        { id: 3, name: 'Bank Transfer', key: 'bank_transfer' },
    ];

    customForm: FormGroup;
    constructor(public fb: FormBuilder,
                public router: Router, public activatedRoute: ActivatedRoute,
                protected service: PaymentService) {
        this.customForm = this.fb.group({
            cardNumber: [null, Validators.required],
            expMonth: [null, Validators.required],
            expYear: [null, Validators.required],
            cvc: [null, Validators.required],
            cardHolder: [null, Validators.required],
            address: [null, Validators.required],
            city: [null, Validators.required],
            state: [null, Validators.required],
            pinCode: [null, Validators.required],
            email: [null, Validators.required],
            amount: [null],
            tax: [null],
            netAmount: [null],
            paymentMode: [null],
            paymentReferenceNumber: [null],
            remark: [null],
            //licenseId: [null, Validators.required],
            licenseTypeId: [null, Validators.required],
            terms: [null],
            desc: [null]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get formPaymentMode() { return this.customForm.get('paymentMode'); }
    changePaymentMode(key) { return this.formPaymentMode.setValue(key); }

    ngOnInit()
    {
        this.customForm.patchValue({
            cardNumber: 123453523,
            expMonth: 11,
            expYear: 2026,
            cvc: 123,
            cardHolder: 'Ashiss Chaturvedi',
            address: '123 sada in Heaven',
            city: 'San Ramon',
            state: 'CA',
            pinCode: 93458,
            email: 'me.ashish005@gmail.com',
            netAmount: 200,
        });
        this.submitted = false;
        this.isLoading = true;
        const success = (resp)=>{
            this.isLoading = false;
            this.software = new PaymentSoftware(resp);
            this.activeLicenseType = this.software.licenseTypes.find(r => r.isRecommended);
            this.populateFinalRates();
        };
        const failure = ()=>{ this.isLoading = false; };
        this.subscriber = this.service.getPaymentLookup().subscribe(success, failure);
    }

    ngOnDestroy()
    {
        this.subscriber?.unsubscribe();
    }

    updateLicenseType(planType, data: PaymentSoftwareLicenseType)
    {
        this.planType = planType;
        this.activeLicenseType = data;
        this.populateFinalRates();
    }

    populateFinalRates()
    {
        const price: any = this.activeLicenseType.discountedRate();
        const tax: any = this.activeLicenseType.taxAmount();
        const netAmount: any = this.activeLicenseType.paymentAmount();

        this.customForm.get('amount').setValue(parseFloat(price).toFixed(2));
        this.customForm.get('tax').setValue(parseFloat(tax).toFixed(2));
        this.customForm.get('netAmount').setValue(parseFloat(netAmount).toFixed(2));

        this.customForm.get('licenseTypeId').setValue(this.activeLicenseType.id);
        // this.customForm.get('terms').setValue(data.terms);
        // this.customForm.get('desc').setValue(data.desc);
    }

    purchaseTicket() {
        this.customForm.markAllAsTouched();
        const formData = this.customForm.getRawValue();
        const { card_number, exp_month, exp_year, cvc, card_holder } = formData;
        const card = { number: card_number, exp_month: exp_month, exp_year: exp_year, cvc: cvc };

        this.submitted = true;
        const stripeResponse = (status: number, response: any) =>
        {
            if (status === 200) {
                this.saveForm(formData, response);
            } else {
                this.submitted = false;
                //this.errorMessage = 'There was a problem purchasing the ticket.';
            }
        };
        this.saveForm(formData, { id: 'rrturrrytryrrvrytrytrvyrtyrvryt'});
        //(<any>window).Stripe.card.createToken(card, stripeResponse);
    }

    saveForm(formData, payGatewayResp)
    {
        this.customForm.markAsTouched();
        const { cardHolder, address, city, state, pincode, email, amount, tax, netAmount, remark, licenseTypeId, terms, desc, paymentMode } = formData;

        const model = {
            name: cardHolder, address: address, city: city, state: state, pincode: pincode, email: email,
            amount: amount, tax: tax, netAmount: netAmount,
            paymentMode: paymentMode, paymentReferenceNumber: payGatewayResp.id,
            remark: remark,
            licenseTypeId, description: desc, terms: terms,
            softwareId: this.software.id,
        };

        const success = ()=>{
            this.customForm.reset();
            this.submitted = false;
            this.router.navigate(['payment-success'], { relativeTo: this.activatedRoute.parent });
            //this.successMessage = 'Thank you for purchasing a ticket!';
        };
        const failure = ()=>{
            this.submitted = false;
            //this.errorMessage = 'There was a problem registering you.';
        };
        this.service.savePaymentDetails(model).toPromise().then(success, failure);
    }
}