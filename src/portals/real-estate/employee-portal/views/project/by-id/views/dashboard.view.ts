import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectAPIResolver} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/dashboard.html'
})
export class DashboardView implements OnInit {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
  id: string;
    public chartOptions: any;
    public pieChartOptions: any;//Partial<ChartOptions>;

    projectSummaryItems: Array<any> = [
        { type: 'module' },
        { type: 'deadline' },
        { type: 'outstanding' },
        { type: 'budget' }
    ];
    pageTitle: string;
    pageIcon: string;

    constructor(public activatedRoute: ActivatedRoute, public apiResolver: ProjectAPIResolver) {

    }

  ngOnInit(){
      /*this.id = this.activatedRoute.parent.snapshot.params.projectId;
      const { data, parent} = this.activatedRoute.snapshot;
      this.pageTitle = data.title || parent?.data?.title;
      this.pageIcon = data.icon || parent?.data?.icon;*/
  }
}
