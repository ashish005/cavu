import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { SharedService } from "@app-global";

@Component({
  standalone: false,
  templateUrl: './templates/invoice-template.html'
})
export class InvoiceTemplateView implements OnInit{
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
  constructor(public activatedRoute: ActivatedRoute,
              public sharedService: SharedService) {
  }
  ngOnInit(){}
}
