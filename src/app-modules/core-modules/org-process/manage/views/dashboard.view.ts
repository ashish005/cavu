import {Component, OnInit} from "@angular/core";

@Component({
  templateUrl: './templates/dashboard.html',
  styles: [`:host {display: contents;}`]
})
export class DashboardView implements OnInit {
  ngOnInit(){}
}
