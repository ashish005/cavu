import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import  { OrgResourceService } from "@app-global"
import {ExpenseLookup, ExpenseLookupSerializer} from "../domains/expense.lookup";
import {Subject, Observable} from "rxjs";

@Injectable()
export class ExpenseAPIResolver extends OrgResourceService<ExpenseLookup> implements Resolve<any> {
  masterType: ExpenseLookup;
  public readonly subject: Subject<boolean> = new Subject();
  getSubject(): Observable<boolean> { return this.subject.asObservable(); }

  constructor(override injector: Injector) {
      super(injector, 'expenseLookup/officeExpense', new ExpenseLookupSerializer());
  }

  resolve(route: ActivatedRouteSnapshot) {
   const success = (results) => {
      this.masterType = results.data;
    };
    const failure = (err: any) => {};
    const setup = this.read(this.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }

    /*showExpensePopup(inputData, popupHeader){
        /!*inputData.lookupMasterType = 'expense';
        const onSuccess = (resp)=> { this.subject.next(true); this.pluginFactory.destroy(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        const modal$ = this.pluginFactory.showVoucherReportPopup(inputData, popupHeader);
        modal$.then(onSuccess, onFailure);*!/
    }

    showPaymentPopup(inputData, popupHeader){
        /!*inputData.lookupMasterType = 'expense';
        const onSuccess = (resp)=> { this.subject.next(true); this.pluginFactory.destroy(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        const modal$ = this.pluginFactory.showVoucherPurchasePaymentPopup(inputData, popupHeader);
        modal$.then(onSuccess, onFailure);*!/
    }*/
}
