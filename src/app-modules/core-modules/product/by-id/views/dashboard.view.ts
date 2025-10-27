import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductByIdService} from "../services/product.service";

@Component({
  standalone: false,
  templateUrl: './templates/dashboard.html'
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
  constructor(private router: Router, public activatedRoute: ActivatedRoute, public apiResolver: ProductByIdService) {
    const { productId } = activatedRoute.parent.snapshot.params;
    this.id = productId;
  }

  ngOnInit(){}
}
