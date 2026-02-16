import {Component} from "@angular/core";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
    templateUrl: './templates/payment-success.html'
})
export class PaymentSuccessView {
    constructor(public router: Router, public activatedRoute: ActivatedRoute) {}
}