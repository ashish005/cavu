import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({ template: '' })
export class LogoutCallbackView implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    //this.router.navigate(['/']);
    // Show message or navigate user back after consent
    // Could optionally notify server that user has consented
  }
}
