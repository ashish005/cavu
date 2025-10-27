import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './main.html'
})
export class DashboardView implements OnInit {
  title: string;
  constructor(private activatedRoute: ActivatedRoute){
  }

  ngOnInit(){}
}
