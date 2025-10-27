import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/my-task-dashboard.html'
})
export class MyTaskDashboardView implements OnInit {
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute) {}
    ngOnInit(){}
}
