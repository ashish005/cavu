import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  standalone: false,
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit(){
  }
}
