import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/profile-friends.html'
})
export class ProfileFriendsView {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {
  }
}
