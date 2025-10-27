import {Injectable, Injector} from "@angular/core";
import {Observable, Subject, throwError} from "rxjs";
import  { OrgResourceService, CoreResponse } from "@app-global";
import {GroupLedgerCombo, GroupLedgerComboSerializer} from "../domains/group-ledger-combo.serializer";
import {map, catchError} from "rxjs";
import {FinanceLedgerGroupLookup} from "../domains/account-group-lookup.serializer";

@Injectable()
export class FinanceLedgerGroupService extends OrgResourceService<GroupLedgerCombo>{
  private groupLedgerSubject = new Subject<any>();
  syncGroupLedger(data: any) { this.groupLedgerSubject.next(data); }
  syncListener(): Observable<any> { return this.groupLedgerSubject.asObservable(); }

  constructor(public override injector: Injector) {
    super(injector, 'finance-report/group-wise-accounts', new GroupLedgerComboSerializer());
  }


    GetFinanceAccountGroupLookup(forceRefresh?: boolean)
    {
      return this.httpClient.get(this.baseSectorAPIUrl+`finance-report/group-wise`, this.requestHeaders)
          .pipe(catchError(error => { return this.handleError(error, () => this.GetFinanceAccountGroupLookup(forceRefresh)); }))
          .pipe(map((resp: CoreResponse<any>) => (resp.entities || []).map(r => new FinanceLedgerGroupLookup(r))));
    }
}
