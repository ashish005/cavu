import {Injectable, Injector} from "@angular/core";
import {environment} from "@app-environments";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";

@Injectable()
export class TrialBusinessService {
  public viewUrl = `${environment.authBaseUrl}/trialRegister`;
  constructor(protected httpClient: HttpClient) {}

  public create(item: any): Observable<any> {
    return this.httpClient.post(this.viewUrl, item)
      .pipe(
        tap(data => data),
        catchError(error => error)
      );
  }
}

@Injectable()
export class PricingService {
  public viewUrl = `${environment.authBaseUrl}/software/plans/1.0.0`;
  constructor(protected httpClient: HttpClient) {}

  public read(softwareId: any): Observable<any> {
    return this.httpClient.get(`${this.viewUrl}/${softwareId}`)
      .pipe(
        tap(data => data),
        catchError(error => error)
      );
  }
}
