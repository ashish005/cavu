import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  templateUrl: './templates/dashboard.html', standalone: false
})
export class DashboardView implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}
  ngOnInit(){}
}
