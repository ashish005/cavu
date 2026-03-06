import {ActivatedRoute, Router} from "@angular/router";
import {Component} from "@angular/core";

@Component({
  standalone: false,
  templateUrl: './templates/time-table.html'
})
export class TimeTableView {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {
  }
}
