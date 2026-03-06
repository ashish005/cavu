import {ActivatedRoute, Router} from "@angular/router";
import {Component} from "@angular/core";

@Component({
  standalone: false,
  templateUrl: './templates/home-work.html'
})
export class HomeWorkView {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {
  }
}
