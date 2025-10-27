import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {OAuthService} from "angular-oauth2-oidc";

@Component({
  template: ``,
  standalone: false
})
export class LoginCallbackView implements OnInit {
  constructor(private authService: OAuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.initLoginFlow();
    // Show message or navigate user back after consent
    // Could optionally notify server that user has consented
  }
}
