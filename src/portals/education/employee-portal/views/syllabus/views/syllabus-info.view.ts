import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/syllabus-info.html'
})
export class SyllabusInfoView {
  constructor(public router: Router,
              public activatedRoute: ActivatedRoute) {
  }
}
