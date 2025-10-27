import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/dashboard.html',
  styles: [`:host { display: contents;}`]
})
export class DashboardView {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {}
}
