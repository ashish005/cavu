import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/profile-activity.html'
})
export class ProfileActivityView {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {
  }
}
