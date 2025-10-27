import {Component, OnInit} from '@angular/core';
import {filter, Observable} from "rxjs";
import {AuthService} from "./third-party/identity/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'body',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'Enrator';
  isAuthenticated$: Observable<boolean>;
  isDoneLoading$: Observable<boolean>;
  canActivateProtectedRoutes$: Observable<boolean>;

  public readonly defaultHomeUrl: string = '/app';
  public readonly loginUrl: string = '/login-callback';
  public loginRedirectUrl: string | null;
  public logoutRedirectUrl: string | null = '/';

  isAuthenticated = false;
  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isDoneLoading$ = this.authService.isDoneLoading$;
    this.canActivateProtectedRoutes$ = this.authService.canActivateProtectedRoutes$;
  }

  ngOnInit(){
    this.isAuthenticated$.subscribe(r => {
      if(this.isAuthenticated != r){
        this.isAuthenticated = r;
        if(!r){
          this.redirectLogoutUser();
        } else {
          this.redirectLoginUser(r);
        }
      }
    });
  }

  login() { this.authService.login(); }
  logout() { this.authService.logout(); }
  refresh() { this.authService.refresh(); }
  reload() { window.location.reload(); }
  clearStorage() { localStorage.clear(); }

  logoutExternally() {
    window.open(this.authService.logoutUrl);
  }

  get hasValidToken() { return this.authService.hasValidToken(); }
  get accessToken() { return this.authService.accessToken; }
  get refreshToken() { return this.authService.refreshToken; }
  get identityClaims() { return this.authService.identityClaims; }
  get idToken() { return this.authService.idToken; }

  redirectLoginUser(isAuthenticated: boolean) {
    let redirect = this.loginUrl;
    if(isAuthenticated){
      redirect = this.loginRedirectUrl ? this.loginRedirectUrl: this.defaultHomeUrl;
    }
    this.loginRedirectUrl = redirect;

    const urlParamsAndFragment = this.splitInTwo(redirect, '#');
    const urlAndParams = this.splitInTwo(urlParamsAndFragment.firstPart, '?');

    const navigationExtras: any = {
      fragment: urlParamsAndFragment.secondPart,
      queryParams: urlAndParams.secondPart ? this.getQueryParamsFromString(urlAndParams.secondPart) : null,
      queryParamsHandling: 'merge'
    };
    this.router.navigate([urlAndParams.firstPart], navigationExtras);
  }

  redirectLogoutUser() {
    const redirect = this.logoutRedirectUrl;
    //this.configurations.resetUiSettings();
    this.router.navigate([redirect]);
  }

  private getQueryParamsFromString(paramString: string) {
      const params: { [key: string]: string | undefined } = {};

      for (const param of paramString?.split('&')) {
          const keyValue = this.splitInTwo(param, '=');
          params[keyValue.firstPart] = keyValue.secondPart;
      }

      return params;
  }

  private splitInTwo(text: string, separator: string, splitFromEnd = false): { firstPart: string, secondPart: string | undefined } {
      let separatorIndex = -1;

      if (separator !== '') {
          if (!splitFromEnd)
              separatorIndex = text.indexOf(separator);
          else
              separatorIndex = text.lastIndexOf(separator);
      }

      if (separatorIndex === -1) {
          return { firstPart: text, secondPart: undefined };
      }

      const part1 = text.substring(0, separatorIndex).trim();
      const part2 = text.substring(separatorIndex + 1).trim();

      return { firstPart: part1, secondPart: part2 };
  }
}
