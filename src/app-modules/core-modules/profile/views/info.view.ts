import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/profile-info.html'
})
export class ProfileInfoView {
  constructor(public router: Router,
              public activatedRoute: ActivatedRoute) {
  }
}
