import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest} from '@angular/common/http';
import {EMPTY, lastValueFrom, mergeMap, switchMap, catchError, Observable, Subject, from, throwError, of, map, tap, finalize, retry, timer} from 'rxjs';

import {environment} from "@app-environments";
import {CoreQueryOptions, CoreResource, CoreResponse, CoreSerializer} from "./models/core-resource";
import {AppSetupService} from "./app-setup.service";
import {LoaderService} from "./loader.service";
import {AlertService, MessageSeverity} from "../modules/alert";
import {AuthService} from "@app-third-party";

interface ServerError {
    status: number;
    error: {
        error: string;
        error_description: string;
    };
}

@Injectable()
export class CoreEndpointBase {
    private taskPauser: Subject<boolean> | null = null;
    private isRefreshingLogin = false;

    protected httpClient: HttpClient;
    protected readonly authService: AuthService;
    protected readonly alertService: AlertService;
    protected readonly appSetupService: AppSetupService;
    protected readonly loaderService: LoaderService;

    constructor(protected injector: Injector) {
        this.httpClient = injector.get(HttpClient);
        this.alertService = injector.get(AlertService);
        this.authService = injector.get(AuthService);
        this.appSetupService = injector.get(AppSetupService);
        this.loaderService = injector.get(LoaderService);
    }

  // protected performRouteResolver0 = (setupSubscriber: Observable<any>) : Observable<any> => {
  //   this.loaderService.show();
  //   return setupSubscriber.pipe(
  //       map(results => results['data']), // Extract and map the data here
  //       // Use finalize to ensure loader is always hidden
  //       finalize(() => this.loaderService.hide()),
  //       catchError((error: ServerError) => {
  //         // Here, you handle the error but do NOT recursively call the resolver.
  //         // You should probably log the error, show a user-friendly message, etc.
  //         console.error("Route resolver failed", error);

  //         // Return a new observable with the error
  //         // This will pass the error to the subscriber's failure handler
  //         //return throwError(() => err);
  //         return this.handleError(error, () => this.performRouteResolver1(setupSubscriber));
  //       })
  //   );
  // };

  /**
   * Common route resolver helper
   * Handles loader, error, cancellation, and redirect logic.
   */
  protected performRouteResolver2(
  routeData: any,
  observable$: Observable<any>,
  success?: (results: any) => void,
  failure?: (err: any) => void
): Promise<any> {
  this.loaderService.show();
  return new Promise<any>((resolve, reject) => {
    lastValueFrom(
      observable$.pipe(
        map((results) => results),
        finalize(() => this.loaderService.hide()),
        catchError((error: ServerError) => {
          console.error('❌ Route resolver failed:', error);
          if (failure) failure(error);
          reject(error); // Rejects the Promise so router halts
          return EMPTY;
        })
      )
    )
      .then((data) => {
        if (success) success(data);
        resolve(data);
      })
      .catch((err) => {
        if (failure) failure(err);
        this.loaderService.hide();
        reject(err);
      });
  });
}
  
  protected performRouteResolver(info, setup, success, failure){
    return this.performRouteResolver2(info, setup, success, failure);
  }
  // protected performRouteResolver(info, setup, success, failure){
  //   return this.loaderService.resolver(setup, success, failure);
  // }

    protected get appVersion() { return this.appSetupService.appVersion; }
    protected get apiVersion() { return this.appSetupService.apiVersion; }

    //protected get softwareId() { return this.coreService.orgSetup?.softwareId || ''; }
    //protected get softwareCode() { return this.coreService.orgSetup?.softwareCode || ''; }
    //protected get sectorMasterType() { return this.coreService.orgSetup?.sectorMasterType || ''; }
    protected get baseAPIUrl() { return environment.authBaseUrl + '/api'; }
    protected get orgSetup() { return this.appSetupService.appSetup; }
    protected get baseSectorAPIUrl(): string { return this.orgSetup.tenantPoint + '/api'; }
    //public get baseSectorAPIUrl() { return `${environment.authBaseUrl}${this.orgSetup.sectorMasterType}/api/`; }

    private getRequestHeaders(d) {
        const { id: orgId, countryId } = this.orgSetup;
        //const orgBranchId = this.coreService.getOrgBranchId();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g. "Asia/Kolkata"
        const _header = {
            Authorization: `Bearer ${this.authService.accessToken}`,
            'App-Version': this.appVersion,
            'X-Timezone': timezone,
            'OrgUnitId': orgId || '',
            //'OrgBranchId': `${ orgBranchId || '' }`,
            //'OrgSessionId': `${ this.coreService.orgSessionId || '' }`,
            'OrgCountryId': `${ countryId || '' }`
        };

        if(d['Accept']){ _header['Accept'] = d['Accept']; }
        if(d['Content-Type']){ _header['Content-Type'] = d['Content-Type']; }

        return new HttpHeaders(_header);
    }

    protected get requestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
        const d = <any>{
            'Content-Type': 'application/json',
            'Accept': `application/vnd.iman.v${this.apiVersion}+json, application/json, text/plain, */*`,
        };
        return { headers: this.getRequestHeaders(d) };
    }

    protected get getMultipartFileUploadRequestHeaders() {
        const d = <any>{
            'Content-Type': undefined,//'multipart/form-data',
            'Accept': `application/vnd.iman.v${this.apiVersion}+json, application/json, text/plain, */*`,
        };
        return <any>{ headers: this.getRequestHeaders(d), reportProgress: true };
    }

    protected get getFileDownloadRequestHeaders() {
        const d = <any>{
            'Accept': `application/vnd.iman.v${this.apiVersion}+json, text/plain, application/pdf, */*`,
        };
        return <any>{ responseType: 'blob', headers: this.getRequestHeaders(d) };
    }

    public refreshLogin() {
      return of(this.authService.refresh()).pipe(
        catchError((error: ServerError) => {
          return this.handleError(error, () => this.refreshLogin());
        }));
    }

    private refreshInProgress$?: Promise<void>;
    private lastRefreshTime = 0;

    protected handleError(error: any, continuation: () => Observable<any>): Observable<any> {
      // Handle Unauthorized / Expired Token
        debugger
      if (error?.status === 401 || error?.error === 'invalid_token') {
        console.warn('🔐 Intercepted 401 or invalid_token');

        // Throttle: avoid rapid refresh loops
        const now = Date.now();
        if (now - this.lastRefreshTime < 5000) {
          console.warn('⚠️ Refresh already attempted recently. Logging out to prevent infinite loop.');
          this.authService.logout();
          return throwError(() => new Error('Repeated token failure.'));
        }

        // If refresh already in progress, wait for it
        if (this.refreshInProgress$) {
          console.info('⏳ Waiting for ongoing token refresh...');
          return from(this.refreshInProgress$).pipe(
            mergeMap(() => continuation()), // retry once after refresh completes
            catchError(err => {
              console.error('❌ Retry after refresh failed:', err);
              this.authService.logout();
              return throwError(() => new Error('Retry failed after token refresh.'));
            })
          );
        }

        // Begin new refresh process
        console.warn('🔄 Starting token refresh...');
        this.lastRefreshTime = now;

        this.refreshInProgress$ = this.authService.refresh()
          .then(() => {
            console.info('✅ Token refresh succeeded.');
            this.refreshInProgress$ = undefined;
          })
          .catch(refreshErr => {
            console.error('❌ Token refresh failed:', refreshErr);
            this.refreshInProgress$ = undefined;
            this.authService.logout();
            throw refreshErr;
          });

        // Wait for refresh, then retry
        return from(this.refreshInProgress$).pipe(
          mergeMap(() => continuation()),
          catchError(err => {
            console.error('❌ Request failed after refresh attempt:', err);
            this.authService.logout();
            return throwError(() => new Error('Token refresh or retry failed.'));
          })
        );
      }

      // Handle refresh token invalid
      if (error?.error === 'invalid_grant' || error?.error_description?.includes('invalid_grant')) {
        console.warn('⚠️ Refresh token invalid. Logging out...');
        this.authService.logout();
        return throwError(() => new Error('Session expired.'));
      }

      // Generic unhandled errors
      console.error('❌ Server error:', error);
      return throwError(() => error || new Error('Unexpected server error.'));
    }

    // protected handleError(error: any, continuation: () => Observable<any>, hasRetried = false): Observable<any> 
    // {
    //   // 🧩 Handle Unauthorized / Expired Token
    //   if (error?.status === 401 || error?.error === 'invalid_token') {
    //     // Avoid multiple simultaneous refresh attempts
    //     if (this.isRefreshingLogin) {
    //       return this.pauseTask(() => this.handleError(error, continuation, hasRetried));
    //     }

    //     // Prevent recursive infinite retries
    //     if (hasRetried) {
    //       console.error('⚠️ Token refresh already attempted once. Aborting further retries.');
    //       this.authService.logout();
    //       return throwError(() => new Error('Session expired after failed retry.'));
    //     }

    //     this.isRefreshingLogin = true;
    //     console.warn('🔄 Token expired. Attempting refresh...');

    //     const refresh$ = from(this.authService.refresh());

    //     const handleRefreshError = (refreshError: any) => {
    //       console.error('❌ Token refresh failed:', refreshError);
    //       this.isRefreshingLogin = false;
    //       this.resumeTasks(false);
    //       this.authService.logout();
    //       return throwError(() => new Error('Session expired or refresh failed.'));
    //     };

    //     return refresh$.pipe(
    //       mergeMap(() => {
    //         console.info('✅ Token refreshed successfully.');
    //         this.isRefreshingLogin = false;
    //         this.resumeTasks(true);
    //         // Retry only once — pass hasRetried = true
    //         return continuation().pipe(
    //           catchError(err => this.handleError(err, continuation, true))
    //         );
    //       }),
    //       catchError(handleRefreshError)
    //     );
    //   }

    //   // 🧱 Handle invalid_grant (refresh token invalid)
    //   if (error?.error === 'invalid_grant' || error?.error_description?.includes('invalid_grant')) {
    //     console.warn('⚠️ Refresh token invalid. Logging out...');
    //     this.authService.logout();
    //     return throwError(() => new Error('Session expired.'));
    //   }

    //   // 🧩 Other unhandled errors
    //   console.error('❌ Server error:', error);
    //   return throwError(() => error || new Error('Unexpected server error'));
    // }

    // protected handleError(error: ServerError | any, continuation: () => Observable<any>) {
    //   debugger
    //   if (error.status == 401) {
    //         if (this.isRefreshingLogin) { return this.pauseTask(continuation); }

    //         this.isRefreshingLogin = true;
    //         const handleLoginError = (refreshLoginError)=>{
    //             this.isRefreshingLogin = false;
    //             this.resumeTasks(false);
    //             this.authService.login();
    //             if (refreshLoginError.status == 401 || (refreshLoginError.error?.error == 'invalid_grant')) {
    //                 return throwError(() => new Error('session expired'));
    //             } else {
    //                 return throwError(() => refreshLoginError || new Error('server error'));
    //             }
    //         };

    //         const refresh = this.authService.refresh();
    //         return from(of(refresh)).pipe(
    //             mergeMap(() => {
    //                 this.isRefreshingLogin = false;
    //                 this.resumeTasks(true);
    //                 return continuation();
    //             }),
    //             catchError(handleLoginError));
    //     }

    //     // if (response.StatusCode == HttpStatusCode.Found)
    //     // {
    //     //   // Handle the authentication redirect
    //     //   var loginUrl = response.Headers.Location;
    //     //   // The original URL is included in the query string of the redirect
    //     //   // loginUrl is likely "/Account/Login?ReturnUrl=%2ForgLookup%2Fbusiness-setup"
    //     // }

    //     if (error.error?.error == 'invalid_grant') {
    //         this.authService.login();
    //         return throwError(() => new Error('session expired'));
    //     } else {
    //         return throwError(() => error || new Error('server error'));
    //     }
    // }

    private pauseTask<T>(continuation: () => Observable<any>) {
        if (!this.taskPauser) { this.taskPauser = new Subject(); }

        return this.taskPauser.pipe(switchMap(continueOp => {
            return continueOp ? continuation() : throwError('session expired');
        }));
    }

    private resumeTasks(continueOp: boolean) {
        setTimeout(() => {
            if (this.taskPauser) {
                this.taskPauser.next(continueOp);
                this.taskPauser.complete();
                this.taskPauser = null;
            }
        });
    }
}

class ResourceService<T extends CoreResource> extends CoreEndpointBase {
  protected viewUrl: string;
  constructor(public override injector: Injector, protected serializer: CoreSerializer) {
    super(injector);
  }

public create(item: T): Observable<any> {
  return this.httpClient.post<T>(this.viewUrl, this.serializer.toJson(item), this.requestHeaders)
    .pipe(
      tap(data => this.notifyResponse(data)),
      // 🔁 Retry only twice on transient errors (e.g., network or 5xx)
      retry({
        count: 1,
        delay: (error, retryCount) => {
          console.warn(`⚠️ Retry ${retryCount}/2 failed due to:`, error.message || error);
          return timer(500 * retryCount); // exponential delay: 500ms, 1000ms
        },
        resetOnSuccess: true
      }),
      catchError(error => this.handleError(error, () => this.create(item)))
    );
}

public update(id: string | number, item: T): Observable<any> {
  return this.httpClient
    .put<T>(`${this.viewUrl}/${id}`, this.serializer.toJson(item), this.requestHeaders)
    .pipe(
      tap(data => this.notifyResponse(data)),
      // 🔁 Retry only twice on transient errors (e.g., network or 5xx)
      retry({
        count: 1,
        delay: (error, retryCount) => {
          console.warn(`⚠️ Retry ${retryCount}/2 failed due to:`, error.message || error);
          return timer(500 * retryCount); // exponential delay: 500ms, 1000ms
        },
        resetOnSuccess: true
      }),
      catchError(error => this.handleError(error, () => this.update(id, item)))
    );
}

public patch(id: string | number, item: T): Observable<any> {
  return this.httpClient
    .patch<T>(`${this.viewUrl}/${id}`, this.serializer.toJson(item), this.requestHeaders)
    .pipe(
      tap(data => this.notifyResponse(data)),
      // 🔁 Retry only twice on transient errors (e.g., network or 5xx)
      retry({
        count: 1,
        delay: (error, retryCount) => {
          console.warn(`⚠️ Retry ${retryCount}/2 failed due to:`, error.message || error);
          return timer(500 * retryCount); // exponential delay: 500ms, 1000ms
        },
        resetOnSuccess: true
      }),
      catchError(error => this.handleError(error, () => this.patch(id, item)))
    );
}

public read(id: string): Observable<CoreResponse<T>> {
  return this.httpClient
    .get(`${this.viewUrl}/${id}`, this.requestHeaders)
    .pipe(
      map(data => this.performCoreAction(data)),
      // 🔁 Retry only twice on transient errors (e.g., network or 5xx)
      retry({
        count: 2,
        delay: (error, retryCount) => {
          console.warn(`⚠️ Retry ${retryCount}/2 failed due to:`, error.message || error);
          return timer(500 * retryCount); // exponential delay: 500ms, 1000ms
        },
        resetOnSuccess: true
      }),
      catchError(error => this.handleError(error, () => this.read(id)))
    );
}

public list(queryOptions: CoreQueryOptions): Observable<CoreResponse<T>> {
  return this.httpClient
    .get(`${this.viewUrl}?${queryOptions.toQueryString()}`, this.requestHeaders)
    .pipe(
      map(data => this.performCoreAction(data)),
      // 🔁 Retry only twice on transient errors (e.g., network or 5xx)
      retry({
        count: 2,
        delay: (error, retryCount) => {
          console.warn(`⚠️ Retry ${retryCount}/2 failed due to:`, error.message || error);
          return timer(500 * retryCount); // exponential delay: 500ms, 1000ms
        },
        resetOnSuccess: true
      }),
      //retry(3), // Retry up to 3 times if an error occurs
      catchError(error => this.handleError(error, () => this.list(queryOptions)))
    );
}

public delete(id: number) {
  return this.httpClient.delete(`${this.viewUrl}/${id}`, this.requestHeaders);
}

  public readLookup(id: string) {
    return this.httpClient
        .get(`${this.viewUrl}/${id}`, this.requestHeaders)
        .pipe(
        // 🔁 Retry only twice on transient errors (e.g., network or 5xx)
        retry({
            count: 1,
            delay: (error, retryCount) => {
                console.warn(`⚠️ Retry ${retryCount}/1 failed due to:`, error.message || error);
                return timer(500 * retryCount); // exponential delay: 500ms, 1000ms
            },
            resetOnSuccess: true
        }),
        catchError(error => this.handleError(error, () => this.readLookup(id)))
    );
  }

public updateFormData(methodType: string, uploadDocUrl: string, req: FormData, progressCb , cb) {
  const request = new HttpRequest(methodType, uploadDocUrl, req, { headers: <any>{
      'Content-Type': 'application/json',
      'Accept': `application/vnd.iman.v${this.apiVersion}+json, application/json, text/plain, */*`,
    }, reportProgress: true });
  return this.httpClient.request(request).subscribe(event => {
    if (event.type === HttpEventType.UploadProgress) {
      progressCb(Math.round(100 * event.loaded / event.total));
    } else if (event.type === HttpEventType.Response) {
      cb(event.body);
    }
  });
}

protected notifyResponse(resp: CoreResponse<any> | any) {
  this.alertService.showMessage('Info', resp.message, resp.isSuccess? MessageSeverity.success : MessageSeverity.warn);
}

public performCoreAction(resp) {
  const info = new CoreResponse<T>(resp);
  if(info['data']){
    info.data = this.serializer.fromJson(resp['data']) as T;
  }
  if(info['entities']){
    info.entities = (resp.entities || []).map(item => this.serializer.fromJson(item) as T);
  }
  return info;
}
}

export class OrgResourceService<T extends CoreResource> extends ResourceService<T> {
  constructor(public override injector: Injector, protected endpoint: string, protected override serializer: CoreSerializer) {
    super(injector, serializer);
    this.viewUrl = `${this.baseSectorAPIUrl}/${endpoint}`;
  }
}

export class CoreResourceService<T extends CoreResource> extends ResourceService<T> {
  constructor(public override injector: Injector, protected endpoint: string, protected override serializer: CoreSerializer) {
    super(injector, serializer);
    this.viewUrl = `${this.baseAPIUrl}/${endpoint}`;
  }
}
