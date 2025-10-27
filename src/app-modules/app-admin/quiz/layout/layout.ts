import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  templateUrl: './layout.html'
})
export class LayoutComponent implements OnInit {

  constructor(private router: Router, private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit(){
  }
}
