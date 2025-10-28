import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
  templateUrl: './layout.html'
})
export class Layout {
  constructor(private router: Router, public activatedRoute: ActivatedRoute){
  }
}
