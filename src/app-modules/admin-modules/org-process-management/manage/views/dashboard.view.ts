import {Component, OnInit} from "@angular/core";

@Component({
  standalone: false,
  templateUrl: './templates/dashboard.html',
  styles: [`:host {display: contents;}`]
})
export class DashboardView implements OnInit {
  ngOnInit(){}
}
