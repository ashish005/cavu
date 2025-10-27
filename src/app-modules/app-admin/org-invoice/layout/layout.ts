import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrgInvoiceAPIResolver} from "../services/api.resolver";
import {LookupVoucherType} from "../domains/lookup.serializer";

@Component({
  standalone: false,
  templateUrl: './layout.html',
  styles: [`:host { display: contents;}`]
})
export class MoneyLayout {
 public actionTemplate: TemplateRef<any>;
  page: any;
  constructor(private router: Router, public activatedRoute: ActivatedRoute, public apiResolver: OrgInvoiceAPIResolver) {
      this.page = this.activatedRoute.snapshot.data;
  }

    report: any = {
        name: "Reports", isFLatChildren: true,
        children:[
            { icon:"fa fa-graduation-cap", name: "Account Statement", sortOrder: 1 },
            { icon:"fa fa-graduation-cap", name: "Invoice Details", sortOrder: 1 },
            { icon:"fa fa-location-arrow", name: "Revenue by Client", sortOrder: 1 },
            { icon:"fa fa-folder-open", name: "Payments Collected", sortOrder: 1 },
            { icon:"fa fa-folder-open", name: "Time Entry Details", sortOrder: 1 },
            { icon:"fa fa-folder-open", name: "Retainer Summary", sortOrder: 1 }
        ]
    };

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
    }

    routeToVoucherType(vType: LookupVoucherType) {
        this.apiResolver.vType = vType;
        this.router.navigate([vType.id, 'invoice'], {relativeTo: this.activatedRoute.parent});
    }
}
