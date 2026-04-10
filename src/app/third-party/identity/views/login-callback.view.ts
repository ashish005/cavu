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
    console.log('[LoginCallback] Component initialized');
    console.log('[LoginCallback] Current URL:', window.location.href);
    console.log('[LoginCallback] Has valid token:', this.oauthService.hasValidAccessToken());
    console.log('[LoginCallback] URL has code:', window.location.search.includes('code='));
    console.log('[LoginCallback] URL has state:', window.location.search.includes('state='));

    // Subscribe to token events to detect successful login
    this.oauthService.events
      .pipe(
        filter(event => event.type === 'token_received'),
        take(1)
      )
      .subscribe(() => {
        console.log('[LoginCallback] ✅ Token received event - Authentication successful');
        console.log('[LoginCallback] Redirecting to dashboard...');
        this.router.navigate(['/app/dashboard']);
      });

    // If already authenticated, redirect immediately
    if (this.oauthService.hasValidAccessToken()) {
      console.log('[LoginCallback] ✅ Already has valid token, redirecting to dashboard...');
      this.router.navigate(['/app/dashboard']);
    } else {
      // Try to exchange authorization code for tokens
      console.log('[LoginCallback] 🔑 No token found, calling tryLogin() to exchange code...');
      
      this.oauthService.tryLogin().then(success => {
        console.log('[LoginCallback] tryLogin() result:', success);
        
        if (success) {
          console.log('[LoginCallback] ✅ Token exchange successful');
          console.log('[LoginCallback] New token status:', this.oauthService.hasValidAccessToken());
        } else {
          console.warn('[LoginCallback] ⚠️ tryLogin() returned false - no code to exchange');
          console.log('[LoginCallback] Starting fresh login flow...');
          this.oauthService.initLoginFlow();
        }
      }).catch(err => {
        console.error('[LoginCallback] ❌ tryLogin() threw error:', err);
        console.error('[LoginCallback] Error details:', err?.message || err);
        this.oauthService.initLoginFlow();
      });
    }
  }
}
