import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  templateUrl: './manage.html'
})
export class ManageComponent implements OnInit {

  constructor(private router: Router, private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit(){
  }
}
