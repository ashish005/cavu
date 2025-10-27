import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {ProductAPIResolver} from "../services/api.resolver";

@Component({
  standalone: false,
  templateUrl: './templates/product-dashboard.html'
})
export class ProductDashboardView implements OnInit {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;

  public chartOptions: any;
  public pieChartOptions: any;//Partial<ChartOptions>;
  projectSummaryItems: Array<any> = [
      { type: 'module' },
      { type: 'deadline' },
      { type: 'outstanding' },
      { type: 'budget' }
  ];

  id: string;
  pageTitle: string;
  pageIcon: string;

  constructor(private router: Router, public activatedRoute: ActivatedRoute,
              public apiResolver: ProductAPIResolver) {
    // this.id = activatedRoute.parent.snapshot.params.productId;
    // const { data, parent} = this.activatedRoute.snapshot;
    // this.pageTitle = data.title || parent?.data?.title;
    // this.pageIcon = data.icon || parent?.data?.icon;
  }

  ngOnInit(){}
}
