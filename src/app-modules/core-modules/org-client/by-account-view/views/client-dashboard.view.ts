import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ClientByIdAPIResolver} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/dashboard.html'
})
export class ClientDashboardView implements OnInit{
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    public chartOptions: any;
    public pieChartOptions: any;//Partial<ChartOptions>;

    clientSummaryItems: Array<any> = [
        { type: 'project' },
        { type: 'invoice' },
        { type: 'outstanding' },
        { type: 'budget' }
    ];

    accountId: string;
    pageTitle: string;
    pageIcon: string;
  constructor(private router: Router, public apiResolver: ClientByIdAPIResolver,
              public activatedRoute: ActivatedRoute) {
      // this.accountId = activatedRoute.parent.snapshot.params.accountId;
      // const { data, parent} = this.activatedRoute.snapshot;
      // this.pageTitle = data.title || parent?.data?.title;
      // this.pageIcon = data.icon || parent?.data?.icon;
  }

  ngOnInit(){}
}
