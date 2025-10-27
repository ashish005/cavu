import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/view.html'
})
export class DefaultView implements OnInit{
  constructor(private router: Router,
              private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit(){}
}
