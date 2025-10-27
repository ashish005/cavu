import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  templateUrl: './dashboard.html',
  standalone: false
})
export class DashboardView implements OnInit {
  title: string;
  constructor(private activatedRoute: ActivatedRoute){
    this.title = this.activatedRoute.snapshot.data['title'];
  }

  ngOnInit(){}
}
