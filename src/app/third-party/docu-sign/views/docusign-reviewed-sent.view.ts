import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    template: 'Thank you!',
    standalone: true
})
export class DocusignReviewedSentView implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Show message or navigate user back after consent
    // Could optionally notify server that user has consented
  }
}
