import {Injectable, Injector} from "@angular/core";
import {catchError, map, throwError} from "rxjs";
import {MonthlyFeeInvoiceResponse, MonthlyFeeVoucherWrapper} from "../domain/fee-payment.serializer";
import {CoreEndpointBase} from "@app-global";

@Injectable()
export class FeePaymentService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    getStudentMonthlyPaymentSummaryByClassAndSession(studentBatchId: any, orgSessionId: any){
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}fee/monthwise-summary/${studentBatchId}/${orgSessionId}`, this.requestHeaders)
            .pipe(
                map((resp: any) =>  new MonthlyFeeVoucherWrapper(resp.entities)),
                catchError(error=> this.handleError(error, () => this.getStudentMonthlyPaymentSummaryByClassAndSession(studentBatchId, orgSessionId)))
            );
    }

    getStudentMonthlyPaymentInvoiceByClassAndSession(studentBatchId: string, orgSessionId, month: number, year: number){
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}fee/monthly-invoice/${studentBatchId}/${orgSessionId}/${month}/${year}`, this.requestHeaders)
            .pipe(
                map((resp: any) => resp.entities.map(r => new MonthlyFeeInvoiceResponse(r))),
                catchError(error=> this.handleError(error, () => this.getStudentMonthlyPaymentInvoiceByClassAndSession(studentBatchId, orgSessionId, month, year)))
            );
    }
}