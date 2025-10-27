import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './layout.html'
})
export class Layout {
  title: string;
  constructor(private router: Router, public activatedRoute: ActivatedRoute){
    this.title = activatedRoute.snapshot.data.title || '';
  }
}
