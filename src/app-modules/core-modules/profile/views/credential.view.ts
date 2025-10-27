import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/profile-credential.html'
})
export class ProfileCredentialView {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {
  }
}
