import {Component, Directive, Injector, Input, OnDestroy, OnInit} from "@angular/core";
import {catchError, take, throwError, Subscription} from "rxjs";
import {CoreEndpointBase} from "@app-global";

@Component({
    standalone: false,
    selector: 'invoice-summary',
    templateUrl: './summary.html',
    styles: [`:host { display: contents;}`]
})
export class InvoiceSummaryComponent extends CoreEndpointBase implements OnInit, OnDestroy
{
    isLoading: boolean;
    data: any;
    hasError: boolean;
    errorMsg: any;
    @Input() title: string;
    @Input() endpoint: string;
    subscriber: Subscription;

    constructor(public override injector: Injector) { super(injector); }
    ngOnInit() { this.callService(); }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }

    callService(){
        this.isLoading = true;
        const success = (result)=> {
            this.isLoading = false;
            this.data = result.data;
            this.hasError = false;
            this.errorMsg = null;
        };

        const failure = (result)=> {
            this.isLoading = false;
            this.hasError = true;
            this.errorMsg = 'No Permission to view';
        };
        this.subscriber = this.httpClient
                .get(`${this.baseSectorAPIUrl}orgInvoiceDashboard/${this.endpoint}/${super.apiVersion}`, super.requestHeaders)
                .pipe(take(1), catchError((error) => { return throwError(error); })).subscribe(success, failure);
    }
}
