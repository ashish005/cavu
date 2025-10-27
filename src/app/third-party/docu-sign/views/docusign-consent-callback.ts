import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({ selector: 'app-consent-callback', template: '<p>Consent granted. You may close this window.</p>', standalone: true })
export class ConsentCallbackComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Show message or navigate user back after consent
    // Could optionally notify server that user has consented
  }
}
