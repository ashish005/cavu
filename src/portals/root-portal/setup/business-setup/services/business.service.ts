import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";
import {catchError, Observable, tap} from "rxjs";
import {Business, BusinessSerializer} from "../domains/business.serializer";

@Injectable()
export class BusinessService extends OrgResourceService<Business>{
  constructor(public override injector: Injector) { super(injector, 'v1/tenant', new BusinessSerializer());}

  public trialRegister(item: any): Observable<any> {
    return this.httpClient.post(this.viewUrl + '/trialRegister', item)
        .pipe(
            tap(data => data),
            catchError(error => error)
        );
  }
}