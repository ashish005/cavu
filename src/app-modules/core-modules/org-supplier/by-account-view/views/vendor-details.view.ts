import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {VendorByIdAPIResolver, VendorLookupResolver} from "../services/api.resolver";

@Component({
  templateUrl: './templates/vendor-details.html',
  standalone: false
})
export class VendorDetailsView {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  constructor(public activatedRoute: ActivatedRoute,
              private moduleResolver: VendorLookupResolver, public apiResolver: VendorByIdAPIResolver,
              private router: Router) {
  }
}
