import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {OAuthService} from "angular-oauth2-oidc";
import {filter, take} from "rxjs/operators";

@Component({
  template: `<div class="login-callback-container">
    <h2>Processing login...</h2>
    <p>Please wait while we complete the authentication.</p>
  </div>`,
  standalone: false
})
export class LoginCallbackView implements OnInit {
  constructor(private oauthService: OAuthService, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to token events to detect successful login
    this.oauthService.events
      .pipe(
        filter(event => event.type === 'token_received' || event.type === 'code_received'),
        take(1)
      )
      .subscribe(() => {
        console.log('✅ Authentication successful, redirecting to dashboard...');
        // Redirect to dashboard after successful login
        this.router.navigate(['/app/dashboard']);
      });

    // If already authenticated, redirect immediately
    if (this.oauthService.hasValidAccessToken()) {
      console.log('✅ Already authenticated, redirecting to dashboard...');
      this.router.navigate(['/app/dashboard']);
    } else {
      // Start login flow if not authenticated
      this.oauthService.initLoginFlow();
    }
  }
}
