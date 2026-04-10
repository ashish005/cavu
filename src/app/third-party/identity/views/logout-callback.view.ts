import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {OAuthService} from "angular-oauth2-oidc";

@Component({
  standalone: false,
  template: `<div class="logout-callback-container">
    <h2>Processing logout...</h2>
    <p>Please wait while we complete the sign-out process.</p>
  </div>`
})
export class LogoutCallbackView implements OnInit {
  constructor(private oauthService: OAuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('[LogoutCallback] Component initialized');
    console.log('[LogoutCallback] Current URL:', window.location.href);

    // Ensure discovery document is loaded before processing logout callback
    if (!this.oauthService.discoveryDocumentLoaded) {
      console.log('[LogoutCallback] Discovery document not loaded, loading now...');
      this.oauthService.loadDiscoveryDocument().then(() => {
        console.log('[LogoutCallback] Discovery document loaded, processing logout');
        this.processLogout();
      }).catch(err => {
        console.error('[LogoutCallback] Failed to load discovery document:', err);
        this.router.navigate(['/']);
      });
    } else {
      console.log('[LogoutCallback] Discovery document already loaded, processing logout');
      this.processLogout();
    }
  }

  private processLogout(): void {
    // Try to process the logout response (handles both OIDC RP-initiated and local logout)
    this.oauthService.tryLogin().then(success => {
      console.log('[LogoutCallback] tryLogin() result:', success);
      console.log('[LogoutCallback] Has valid token after logout:', this.oauthService.hasValidAccessToken());

      // After logout, redirect to home page
      console.log('[LogoutCallback] Redirecting to home...');
      this.router.navigate(['/']);
    }).catch(err => {
      console.error('[LogoutCallback] Error processing logout:', err);
      // Even on error, navigate to home page
      this.router.navigate(['/']);
    });
  }
}
